const PDFDocument = require("pdfkit");

// Builds a clean, reliable, text-based itinerary PDF and returns it as a Buffer.
async function buildItineraryPdf({ destination, duration, budget, personality, previewText, fullText }) {
  const doc = new PDFDocument({ margin: 50 });
  const chunks = [];
  doc.on("data", (chunk) => chunks.push(chunk));

  return new Promise((resolve, reject) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.fontSize(24).fillColor("#5C4A32").text("Driftwood", { align: "center" });
    doc.moveDown(0.2);
    doc.fontSize(11).fillColor("#8A7D6A").text("Travel, your way", { align: "center" });
    doc.moveDown(1.5);

    doc.fontSize(20).fillColor("#1E1A14").text(destination || "Your Trip", { align: "center" });
    doc.fontSize(12).fillColor("#4A3F30").text(
      `${duration || ""} days  ·  £${budget || ""}/day  ·  ${personality || ""}`,
      { align: "center" }
    );
    doc.moveDown(1.5);

    const addSection = (text) => {
      if (!text) return;
      const parts = text.split(/\n(?=##\s)/);
      parts.forEach((part) => {
        const lines = part.trim().split("\n");
        const header = lines[0].replace(/^##\s*/, "").trim();
        const body = lines.slice(1).join("\n").trim();
        if (header && !header.startsWith("#")) {
          doc.moveDown(0.8);
          doc.fontSize(15).fillColor("#5C4A32").text(header);
          doc.moveDown(0.3);
        }
        doc.fontSize(10.5).fillColor("#1E1A14");
        body.split("\n").forEach((line) => {
          const clean = line
            .replace(/\*\*(.*?)\*\*/g, "$1")
            .replace(/^###\s*/, "")
            .trim();
          if (!clean) return;
          if (clean.startsWith("- ")) {
            doc.text(`•  ${clean.slice(2)}`, { indent: 10 });
          } else {
            doc.text(clean);
          }
        });
      });
    };

    addSection(previewText);
    addSection(fullText);

    doc.end();
  });
}

// Emails the PDF as an attachment via Resend's API, optionally including a
// link back to the live, interactive version of the itinerary.
async function sendItineraryPdfEmail({ email, destination, pdfBuffer, tripLink }) {
  const linkHtml = tripLink
    ? `<p><a href="${tripLink}">View your live itinerary online</a> — includes booking links and everything you saw on the site.</p>`
    : "";

  const resendRes = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: "Driftwood <login@driftwoodtravel.co>",
      to: email,
      subject: `Your Driftwood itinerary — ${destination || "your trip"}`,
      html: `<p>Hi there,</p><p>Your personalised Driftwood itinerary is attached as a PDF, ready to save, print, or read offline.</p>${linkHtml}<p>Safe travels!<br>The Driftwood team</p>`,
      attachments: [
        {
          filename: "driftwood-itinerary.pdf",
          content: pdfBuffer.toString("base64"),
        },
      ],
    }),
  });

  if (!resendRes.ok) {
    const errData = await resendRes.json().catch(() => ({}));
    throw new Error(errData.message || "Failed to send email");
  }
}

module.exports = { buildItineraryPdf, sendItineraryPdfEmail };
