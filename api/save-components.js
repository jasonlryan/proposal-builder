const fs = require("fs");
const path = require("path");

/**
 * API route handler to save component data with automatic backup creation
 * This runs server-side as a serverless function
 */
async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { data, createBackup } = req.body;

    if (!data || !data.componentLibraries) {
      return res.status(400).json({ message: "Invalid component data format" });
    }

    console.log("Attempting to save component data...");

    // Base paths - use either the current working directory or __dirname if available
    const rootDir = process.cwd();
    console.log("Root directory:", rootDir);

    const publicDir = path.join(rootDir, "public");
    const assetsDir = path.join(publicDir, "assets");
    const backupsDir = path.join(assetsDir, "backups");
    const filePath = path.join(assetsDir, "component-libraries.json");

    console.log("File path:", filePath);
    console.log("Backups directory:", backupsDir);

    // Ensure directories exist
    if (!fs.existsSync(publicDir)) {
      console.log("Creating public directory");
      fs.mkdirSync(publicDir, { recursive: true });
    }

    if (!fs.existsSync(assetsDir)) {
      console.log("Creating assets directory");
      fs.mkdirSync(assetsDir, { recursive: true });
    }

    if (!fs.existsSync(backupsDir)) {
      console.log("Creating backups directory");
      fs.mkdirSync(backupsDir, { recursive: true });
    }

    let backupCreated = false;
    let backupName = "";

    // Create backup if requested
    if (createBackup && fs.existsSync(filePath)) {
      console.log("Creating backup of existing file");
      const timestamp = new Date()
        .toISOString()
        .replace(/[:T.]/g, "-")
        .slice(0, -5);
      backupName = `component-libraries-${timestamp}.bak`;
      const backupPath = path.join(backupsDir, backupName);

      try {
        fs.copyFileSync(filePath, backupPath);
        backupCreated = true;
        console.log(`Backup created: ${backupName}`);
      } catch (backupError) {
        console.error("Error creating backup:", backupError);
        // Continue with saving even if backup fails
      }
    }

    // Write the updated data to the file
    try {
      console.log("Writing data to file");
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      console.log("File successfully written");
    } catch (writeError) {
      console.error("Error writing to file:", writeError);
      return res.status(500).json({
        message: "Failed to write component data to file",
        error: writeError.message,
        details: {
          filePath,
          exists: fs.existsSync(path.dirname(filePath)),
        },
      });
    }

    return res.status(200).json({
      message: "Component data saved successfully",
      backupCreated,
      backupName,
    });
  } catch (error) {
    console.error("Error saving component data:", error);
    return res.status(500).json({
      message: "Failed to save component data",
      error: error.message,
    });
  }
}

// Export for both CommonJS and Next.js API routes
module.exports = {
  default: handler,
};
