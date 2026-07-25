const Stripe = require("stripe");
const { createClient } = require("@supabase/supabase-js");

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
    const { prompt, isLong, kind, sessionId } = req.body;

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
    if (kind === "full") {
      if (!sessionId) {
        return res.status(402).json({ error: "Payment verification required." });
      }
      const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      if (!session || session.payment_status !== "paid") {
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
        max_tokens: isLong ? 1800 : 2900,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();
    console.log("Anthropic response:", JSON.stringify(data));
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
