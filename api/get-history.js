export default async function handler(req, res) {
const { device_id, password } = req.body;

const device = await axios.get(
  `${SUPABASE_URL}/rest/v1/devices?device_id=eq.${device_id}&device_password=eq.${password}`,
  {
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`
    }
  }
);

if (!device.data.length) {
  return res.status(401).send("Unauthorized");
}
  

  const r = await fetch(
    `${process.env.SUPABASE_URL}/rest/v1/device_data?device_id=eq.${device_id}&order=created_at.asc`,
    {
      headers: {
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY
      }
    }
  );

  const data = await r.json();

  res.json(data);
}
