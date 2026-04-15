import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).send("Method not allowed");

  const { device_id, device_secret, tds, water_level } = req.body;

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SERVICE_KEY = process.env.SERVICE_KEY;

  try {
    // verify device
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
      return res.status(401).send("Invalid device");

    if (device.data[0].device_secret !== device_secret)
      return res.status(403).send("Unauthorized");

    // insert data
    await axios.post(
      `${SUPABASE_URL}/rest/v1/device_data`,
      {
        device_id,
        user_id: device.data[0].user_id,
        tds,
        water_level
      },
      {
        headers: {
          apikey: SERVICE_KEY,
          Authorization: `Bearer ${SERVICE_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.send("OK");
  } catch (err) {
    res.status(500).send("Error");
  }
}
