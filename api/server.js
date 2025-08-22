// api/server.js
export default async function handler(req, res) {
  // Добавьте CORS заголовки
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const apiUrl = "https://api.pipe.bot/bot?apikey=df2151f9cfb02c12fa96570e336e94b5&victorina4webapp=";
    
    const response = await fetch(apiUrl);
    const data = await response.json();

    res.status(200).json(data);
  } catch (err) {
    console.error('API Error:', err);
    res.status(500).json({ 
      error: "Помилка проксі", 
      details: err.message 
    });
  }
}