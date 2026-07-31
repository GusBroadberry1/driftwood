const Stripe = require("stripe");
const crypto = require("crypto");
const { createClient } = require("@supabase/supabase-js");
const { buildItineraryPdf, sendItineraryPdfEmail } = require("./_lib/pdfEmail");

const supabaseAdmin = createClient(
  "https://woxnkxvryjbrejsojgsm.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MINUTES = 10;

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt, isLong, kind, sessionId, destination, duration, budget, personality, previewText, form } = req.body;

    // --- Rate limiting: stop any single IP from spamming generations ---
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.socket?.remoteAddress ||
      "unknown";
    const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MINUTES * 60 * 1000).toISOString();

    const { count, error: countError } = await supabaseAdmin
      .from("rate_limits")
      .select("*", { count: "exact", head: true })
      .eq("ip", ip)
      .gte("created_at", windowStart);

    if (!countError && count >= RATE_LIMIT_MAX) {
      return res.status(429).json({
        error: "Too many requests from this connection. Please wait a few minutes and try again.",
      });
    }

    // Log this request for the rate limiter (fire-and-forget; don't block on failure)
    supabaseAdmin.from("rate_limits").insert({ ip }).then(() => {}, () => {});

    // --- Payment verification: only for the full (paid) itinerary ---
    let stripeSession = null;
    if (kind === "full") {
      if (!sessionId) {
        return res.status(402).json({ error: "Payment verification required." });
      }
      const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
      stripeSession = await stripe.checkout.sessions.retrieve(sessionId);
      if (!stripeSession || stripeSession.payment_status !== "paid") {
        return res.status(402).json({ error: "Payment could not be verified for this session." });
      }
    }

    // --- Generate the content ---
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: isLong ? 2600 : 4000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();
    console.log("Anthropic response:", JSON.stringify(data));

    let tripId = null;

    if (kind === "full" && stripeSession) {
      const fullText = data.content?.map((b) => b.text || "").join("\n") || "";

      // --- Save the trip under a random, unguessable ID so the person can
      // revisit the live, interactive itinerary later via a private link ---
      try {
        tripId = crypto.randomBytes(9).toString("base64url");
        await supabaseAdmin.from("shared_trips").insert({
          id: tripId,
          destination,
          duration: String(duration || ""),
          budget: String(budget || ""),
          personality,
          form: form || null,
          preview_text: previewText,
          full_text: fullText,
        });
      } catch (saveErr) {
        console.error("Saving shared trip failed:", saveErr.message);
        tripId = null;
      }

      // --- Auto-email a PDF copy (+ the live link, if saving worked) using
      // the email Stripe collected at checkout. This means the itinerary is
      // safely delivered even if the person closes the tab right after
      // paying, without needing any login/account system. ---
      const customerEmail = stripeSession.customer_details?.email || stripeSession.customer_email;
      if (customerEmail) {
        try {
          const pdfBuffer = await buildItineraryPdf({ destination, duration, budget, personality, previewText, fullText });
          const tripLink = tripId ? `https://driftwoodtravel.co/?trip=${tripId}` : null;
          await sendItineraryPdfEmail({ email: customerEmail, destination, pdfBuffer, tripLink });
        } catch (emailErr) {
          // Don't fail the main response just because the auto-email failed --
          // the person can still use the in-app "Email My Itinerary" option.
          console.error("Auto-send PDF email failed:", emailErr.message);
        }
      }
    }

    res.status(200).json({ ...data, driftwoodTripId: tripId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
