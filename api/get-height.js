import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).send("Method not allowed");

  const { device_id, password } = req.body;

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

    res.json({
      tank_height: device.data[0].tank_height
    });

  } catch (err) {
    res.status(500).send("Error");
  }
}
