export default async function handler(req, res) {
  try {

    // ✅ SAFE BODY HANDLING
    let body = {};

    if (req.body) {
      body = typeof req.body === "string"
        ? JSON.parse(req.body)
        : req.body;
    }

    const device_id = body.device_id;

    if (!device_id) {
      return res.status(400).json({ error: "device_id missing" });
    }

    const url = `${process.env.SUPABASE_URL}/rest/v1/device_data?device_id=eq.${device_id}&order=created_at.desc&limit=1`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
      }
    });

    const data = await response.json();

    return res.json(data[0] || {});

  } catch (err) {
    console.error("ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
}
