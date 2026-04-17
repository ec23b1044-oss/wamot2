export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).send("Method not allowed");

  const { device_id, password, tank_height } = req.body;

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SERVICE_KEY = process.env.SERVICE_KEY;

  try {
    // Check device
    const deviceRes = await fetch(
      `${SUPABASE_URL}/rest/v1/devices?device_id=eq.${device_id}`,
      {
        headers: {
          apikey: SERVICE_KEY,
          Authorization: `Bearer ${SERVICE_KEY}`
        }
      }
    );

    const device = await deviceRes.json();

    if (!device.length)
      return res.status(401).send("Invalid");

    if (device[0].device_password !== password)
      return res.status(403).send("Unauthorized");

    // Update tank height
    await fetch(
      `${SUPABASE_URL}/rest/v1/devices?device_id=eq.${device_id}`,
      {
        method: "PATCH",
        headers: {
          apikey: SERVICE_KEY,
          Authorization: `Bearer ${SERVICE_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ tank_height })
      }
    );

    res.json({ success: true });

  } catch (err) {
    res.status(500).send("Error");
  }
}
