const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 7777;

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/temp", (req, res) => {
  try {
    const raw = fs.readFileSync("/sys/class/thermal/thermal_zone0/temp", "utf8");
    const tempC = parseInt(raw, 10) / 1000;

    res.json({
      temperature: tempC,
      status:
        tempC < 55 ? "cool" :
        tempC < 70 ? "warm" : "hot"
    });
  } catch (err) {
    console.error("Temp read error:", err);
    res.status(500).json({ error: "Cannot read temperature" });
  }
});

app.listen(PORT, () => {
  console.log(`Pi Temp Widget running on port ${PORT}`);
});
