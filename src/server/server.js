import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const PORT = 4000;

app.use(cors());

app.get("/quiz", async (req, res) => {
  try {
    const apiUrl = "https://api.pipe.bot/bot?apikey=df2151f9cfb02c12fa96570e336e94b5&victorina4webapp=";
    const r = await fetch(apiUrl);
    const data = await r.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Помилка проксі", details: err.message });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
});
