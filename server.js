const express = require("express");
const cors = require("cors");
require("dotenv").config();

const allowedOrigins = [
  "http://localhost:8080",
  "https://fareclock-fe-865387012349.europe-west1.run.app",
];

const settingRoute = require("./routes/setting");
const workerRoute = require("./routes/worker");
const shiftRoute = require("./routes/shift");

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/settings", settingRoute);
app.use("/api/", workerRoute);
app.use("/api/", shiftRoute);

app.get("/api/health", async (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    timezone: "UTC",
  });
});

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err)
    res.status(400).json({
      error: "JSON payload could be malformed or missing",
      message: err.message,
    });
  else
    res
      .status(500)
      .json({ error: "A server error has occured, contact system admin" });
  console.error(err);
});

app.all("/{*any}", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
});
