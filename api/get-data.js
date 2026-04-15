import axios from "axios";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    // ✅ SAFE BODY PARSE
    const body = typeof req.body === "string"
      ? JSON.parse(req.body)
      : req.body;

    const { device_id, password } = body;

    if (!device_id || !password) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

    // 🔐 1. VERIFY DEVICE
    const deviceRes = await axios.get(
      `${SUPABASE_URL}/rest/v1/devices?device_id=eq.${device_id}&device_password=eq.${password}`,
      {
        headers: {
          apikey: SERVICE_KEY,
          Authorization: `Bearer ${SERVICE_KEY}`
        }
      }
    );

    if (!deviceRes.data.length) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // 📊 2. GET LATEST DATA
    const dataRes = await axios.get(
      `${SUPABASE_URL}/rest/v1/device_data?device_id=eq.${device_id}&order=created_at.desc&limit=1`,
      {
        headers: {
          apikey: SERVICE_KEY,
          Authorization: `Bearer ${SERVICE_KEY}`
        }
      }
    );

    return res.json(dataRes.data[0] || {});

  } catch (err) {
    console.error("get-data error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
