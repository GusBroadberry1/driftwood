const { buildItineraryPdf, sendItineraryPdfEmail } = require("./_lib/pdfEmail");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, destination, duration, budget, personality, previewText, fullText, tripId } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const pdfBuffer = await buildItineraryPdf({ destination, duration, budget, personality, previewText, fullText });
    const tripLink = tripId ? `https://driftwoodtravel.co/?trip=${tripId}` : null;
    await sendItineraryPdfEmail({ email, destination, pdfBuffer, tripLink });

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
