import fs from "fs";
import path from "path";

/**
 * API route handler to save component data with automatic backup creation
 * This runs server-side as a serverless function
 */
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { data, createBackup } = req.body;

    if (!data || !data.componentLibraries) {
      return res.status(400).json({ message: "Invalid component data format" });
    }

    // Base paths
    const publicDir = path.join(process.cwd(), "public");
    const assetsDir = path.join(publicDir, "assets");
    const backupsDir = path.join(assetsDir, "backups");
    const filePath = path.join(assetsDir, "component-libraries.json");

    // Ensure directories exist
    if (!fs.existsSync(backupsDir)) {
      fs.mkdirSync(backupsDir, { recursive: true });
    }

    let backupCreated = false;
    let backupName = "";

    // Create backup if requested
    if (createBackup && fs.existsSync(filePath)) {
      const timestamp = new Date()
        .toISOString()
        .replace(/[:T.]/g, "-")
        .slice(0, -5);
      backupName = `component-libraries-${timestamp}.bak`;
      const backupPath = path.join(backupsDir, backupName);

      fs.copyFileSync(filePath, backupPath);
      backupCreated = true;
    }

    // Write the updated data to the file
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

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
