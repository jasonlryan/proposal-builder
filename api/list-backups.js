const fs = require("fs");
const path = require("path");

/**
 * API route handler to list available component backups
 * This runs server-side as a serverless function
 */
async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    // Base paths
    const publicDir = path.join(process.cwd(), "public");
    const assetsDir = path.join(publicDir, "assets");
    const backupsDir = path.join(assetsDir, "backups");

    console.log("Looking for backups in:", backupsDir);

    // If backups directory doesn't exist, return empty array
    if (!fs.existsSync(backupsDir)) {
      console.log("Backups directory does not exist");
      return res.status(200).json({
        message: "No backups found",
        backups: [],
      });
    }

    // Read directory and filter for .bak files
    const files = fs
      .readdirSync(backupsDir)
      .filter((filename) => filename.endsWith(".bak"))
      .map((filename) => {
        const filePath = path.join(backupsDir, filename);
        const stats = fs.statSync(filePath);

        // Extract timestamp from filename
        let timestamp = "";
        const match = filename.match(/component-libraries-(.+)\.bak/);
        if (match && match[1]) {
          timestamp = match[1].replace(/-/g, (i, pos) => {
            if (pos === 10) return "T";
            if ([13, 16].includes(pos)) return ":";
            return pos === 19 ? "." : "-";
          });
        }

        return {
          name: filename,
          size: stats.size,
          created: stats.birthtime.toISOString(),
          timestamp,
          fullPath: filePath,
        };
      })
      // Sort by creation date, newest first
      .sort((a, b) => new Date(b.created) - new Date(a.created));

    console.log(`Found ${files.length} backup files`);

    return res.status(200).json({
      message: `Found ${files.length} backups`,
      backups: files,
    });
  } catch (error) {
    console.error("Error fetching backups list:", error);
    return res.status(500).json({
      message: "Failed to fetch backups list",
      error: error.message,
    });
  }
}

// Export for both CommonJS and Next.js API routes
module.exports = {
  default: handler,
};
