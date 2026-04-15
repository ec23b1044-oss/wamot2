export default async function handler(req, res) {

  const { device_id, password } = req.body;

  const r = await fetch(
    `${process.env.SUPABASE_URL}/rest/v1/devices?device_id=eq.${device_id}&device_password=eq.${password}`,
    {
      headers: {
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY
      }
    }
  );

  const data = await r.json();

  if (data.length === 0) {
    return res.status(401).json({ success: false });
  }

  res.json({ success: true });
}
