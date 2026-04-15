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
    const password = body.password

    if (!device_id) {
      return res.status(400).json({ error: "device_id missing" });
    }
 const SUPABASE_URL = process.env.SUPABASE_URL;
  const SERVICE_KEY = process.env.SERVICE_KEY;

  try {
    const device = await axios.get(
      `${SUPABASE_URL}/rest/v1/devices?device_id=eq.${device_id}`,
      {
        headers: {
          apikey: SERVICE_KEY,
          Authorization: `Bearer ${SERVICE_KEY}`
        }
      }
    );

    if (!device.data.length)
      return res.status(401).send("Invalid");

    if (device.data[0].device_password !== password)
      return res.status(403).send("Unauthorized");

  } catch (err) {
    res.status(500).send("Error");
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
