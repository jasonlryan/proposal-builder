const fs = require("fs");
const path = require("path");

/**
 * API route handler to restore from a backup file
 * This runs server-side as a serverless function
 */
async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { backupName } = req.body;

    if (!backupName || !backupName.endsWith(".bak")) {
      return res.status(400).json({ message: "Invalid backup file name" });
    }

    console.log(`Attempting to restore from backup: ${backupName}`);

    // Base paths
    const publicDir = path.join(process.cwd(), "public");
    const assetsDir = path.join(publicDir, "assets");
    const backupsDir = path.join(assetsDir, "backups");
    const originalFilePath = path.join(assetsDir, "component-libraries.json");
    const backupPath = path.join(backupsDir, backupName);

    console.log("Original file path:", originalFilePath);
    console.log("Backup path:", backupPath);

    // Check if backup file exists
    if (!fs.existsSync(backupPath)) {
      console.log("Backup file not found");
      return res.status(404).json({ message: "Backup file not found" });
    }

    // Before restoring, create a current-state backup
    const timestamp = new Date()
      .toISOString()
      .replace(/[:T.]/g, "-")
      .slice(0, -5);
    const currentStateBackup = `pre-restore-${timestamp}.bak`;
    const currentStateBackupPath = path.join(backupsDir, currentStateBackup);

    console.log("Creating pre-restore backup at:", currentStateBackupPath);

    if (fs.existsSync(originalFilePath)) {
      fs.copyFileSync(originalFilePath, currentStateBackupPath);
      console.log("Pre-restore backup created");
    }

    // Restore the file from backup
    console.log("Restoring file from backup");
    fs.copyFileSync(backupPath, originalFilePath);
    console.log("File restored successfully");

    // Read the restored file to return its data
    const restoredData = JSON.parse(fs.readFileSync(originalFilePath, "utf8"));
    console.log("Restored data parsed successfully");

    return res.status(200).json({
      message: `Restored from backup: ${backupName}`,
      currentStateBackup,
      data: restoredData,
    });
  } catch (error) {
    console.error("Error restoring from backup:", error);
    return res.status(500).json({
      message: "Failed to restore from backup",
      error: error.message,
    });
  }
}

// Export for both CommonJS and Next.js API routes
module.exports = {
  default: handler,
};
