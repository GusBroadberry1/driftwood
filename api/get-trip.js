const { createClient } = require("@supabase/supabase-js");

const supabaseAdmin = createClient(
  "https://woxnkxvryjbrejsojgsm.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ error: "Missing trip id" });
    }

    const { data, error } = await supabaseAdmin
      .from("shared_trips")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: "Trip not found" });
    }

    res.status(200).json({
      destination: data.destination,
      duration: data.duration,
      budget: data.budget,
      personality: data.personality,
      form: data.form,
      previewText: data.preview_text,
      fullText: data.full_text,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
