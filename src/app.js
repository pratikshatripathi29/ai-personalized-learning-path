const express = require("express");
const cors = require("cors");
const path = require("path");

const pathRoutes = require("./routes/pathRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "AI learning path generator API is healthy."
  });
});

app.use("/api", pathRoutes);

if (process.env.NODE_ENV === "production") {
  const clientBuildPath = path.join(__dirname, "..", "client", "dist");
  app.use(express.static(clientBuildPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(clientBuildPath, "index.html"));
  });
}

module.exports = app;
