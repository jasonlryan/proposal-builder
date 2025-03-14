// File operations utilities for component editor
import axios from "axios";

// Determine the base URL based on the environment
const getApiBaseUrl = () => {
  // Check if we're in development or production
  const isProduction = process.env.NODE_ENV === "production";
  const devApiPort = 5050; // Changed from 5000 to 5050

  if (isProduction) {
    return ""; // In production, API calls are relative to the same domain
  } else {
    // In development, we need to specify the server URL with port
    return `http://localhost:${devApiPort}`;
  }
};

/**
 * Save component data to the server with automatic backup creation
 * @param {Object} data - The full component library data to save
 * @returns {Promise} - Promise with the result of the operation
 */
export const saveComponentData = async (data) => {
  try {
    const baseUrl = getApiBaseUrl();
    console.log(`Saving component data to: ${baseUrl}/api/save-components`);

    const response = await axios.post(`${baseUrl}/api/save-components`, {
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
    const baseUrl = getApiBaseUrl();
    console.log(`Fetching backups from: ${baseUrl}/api/list-backups`);

    const response = await axios.get(`${baseUrl}/api/list-backups`);
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
    const baseUrl = getApiBaseUrl();
    console.log(`Restoring from backup: ${baseUrl}/api/restore-backup`);

    const response = await axios.post(`${baseUrl}/api/restore-backup`, {
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
