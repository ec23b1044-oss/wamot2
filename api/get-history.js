import axios from "axios";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { device_id, password } = req.body;

    if (!device_id || !password) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SERVICE_KEY = process.env.SERVICE_KEY;

    // 🔐 1. VERIFY DEVICE
    const device = await axios.get(
      `${SUPABASE_URL}/rest/v1/devices?device_id=eq.${device_id}`,
      {
        headers: {
          apikey: SERVICE_KEY,
          Authorization: `Bearer ${SERVICE_KEY}`
        }
      }
    );

    if (!device.data.length) {
      return res.status(401).send("Invalid");
    }

    if (device.data[0].device_password !== password) {
      return res.status(403).send("Unauthorized");
    }

    // 📊 2. GET HISTORY DATA
    const r = await fetch(
      `${SUPABASE_URL}/rest/v1/device_data?device_id=eq.${device_id}&order=created_at.asc`,
      {
        headers: {
          apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
        }
      }
    );

    const data = await r.json();

    return res.json(data || []);

  } catch (err) {
    console.error("get-history error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
