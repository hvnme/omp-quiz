import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    const apiUrl = "https://api.pipe.bot/bot?apikey=df2151f9cfb02c12fa96570e336e94b5&victorina4webapp=";
    const r = await fetch(apiUrl);
    const data = await r.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Помилка проксі", details: err.message });
  }
}
