// File operations utilities for component editor
import axios from "axios";

/**
 * Save component data to the server with automatic backup creation
 * @param {Object} data - The full component library data to save
 * @returns {Promise} - Promise with the result of the operation
 */
export const saveComponentData = async (data) => {
  try {
    const response = await axios.post("/api/save-components", {
      data,
      createBackup: true,
    });

    return {
      success: true,
      message: response.data.message,
      backupCreated: response.data.backupCreated,
      backupName: response.data.backupName,
    };
  } catch (error) {
    console.error("Error saving component data:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to save component data",
      error,
    };
  }
};

/**
 * Get list of available backup files
 * @returns {Promise} - Promise with the list of backup files
 */
export const getBackupsList = async () => {
  try {
    const response = await axios.get("/api/list-backups");
    return {
      success: true,
      backups: response.data.backups,
    };
  } catch (error) {
    console.error("Error fetching backups list:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch backups",
      backups: [],
    };
  }
};

/**
 * Restore from a specific backup file
 * @param {string} backupName - Name of the backup file to restore from
 * @returns {Promise} - Promise with the result of the operation
 */
export const restoreFromBackup = async (backupName) => {
  try {
    const response = await axios.post("/api/restore-backup", {
      backupName,
    });

    return {
      success: true,
      message: response.data.message,
      data: response.data.data,
    };
  } catch (error) {
    console.error("Error restoring from backup:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to restore from backup",
      error,
    };
  }
};

/**
 * For environments without a server, this will just download the JSON file
 * @param {Object} data - The component library data to download
 */
export const downloadComponentData = (data) => {
  const dataStr = JSON.stringify(data, null, 2);
  const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(
    dataStr
  )}`;

  const timestamp = new Date()
    .toISOString()
    .replace(/[:T.]/g, "-")
    .slice(0, -5);
  const exportFileDefaultName = `component-libraries-${timestamp}.json`;

  const linkElement = document.createElement("a");
  linkElement.setAttribute("href", dataUri);
  linkElement.setAttribute("download", exportFileDefaultName);
  linkElement.click();
  linkElement.remove();

  return {
    success: true,
    message: `File downloaded as ${exportFileDefaultName}`,
    fileName: exportFileDefaultName,
  };
};
