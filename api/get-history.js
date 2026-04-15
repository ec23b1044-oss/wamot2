export default async function handler(req, res) {
const { device_id, password } = req.body;

// verify
const { data: user } = await supabase
  .from("devices")
  .select("*")
  .eq("device_id", device_id)
  .eq("device_password", password);

if (!user || user.length === 0)
  return res.status(401).json({ error: "Unauthorized" });
  
  const { device_id } = req.body;

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
