export default async function handler(req, res) {

  const { device_id, password, state } = req.body;

  await fetch(
    `${process.env.SUPABASE_URL}/rest/v1/devices?device_id=eq.${device_id}&device_password=eq.${password}`,
    {
      method: "PATCH",
      headers: {
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ relay_state: state })
    }
  );

  res.json({ success: true });
}
