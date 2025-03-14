const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
const cors = require("cors");

// Import API handlers
const saveComponentsHandler = require("./api/save-components").default;
const listBackupsHandler = require("./api/list-backups").default;
const restoreBackupHandler = require("./api/restore-backup").default;

const app = express();
const PORT = process.env.PORT || 5050;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(express.static(path.join(__dirname, "build")));

// Convert Express req/res to Next.js API format
const adaptRoute = (handler) => async (req, res) => {
  try {
    await handler(req, res);
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// API Routes
app.post("/api/save-components", adaptRoute(saveComponentsHandler));
app.get("/api/list-backups", adaptRoute(listBackupsHandler));
app.post("/api/restore-backup", adaptRoute(restoreBackupHandler));

// Serve static assets
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

// Serve React app
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API endpoints available at:`);
  console.log(` - POST /api/save-components`);
  console.log(` - GET /api/list-backups`);
  console.log(` - POST /api/restore-backup`);
  console.log(
    `Static assets served from: ${path.join(__dirname, "public/assets")}`
  );
});
