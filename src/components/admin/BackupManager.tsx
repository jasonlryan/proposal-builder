import React, { useState, useEffect } from "react";
import { getBackupsList, restoreFromBackup } from "../../api/fileOps";

interface Backup {
  name: string;
  size: number;
  created: string;
  timestamp: string;
}

interface BackupManagerProps {
  onRestoreComplete: (newData: any) => void;
}

const BackupManager: React.FC<BackupManagerProps> = ({ onRestoreComplete }) => {
  const [backups, setBackups] = useState<Backup[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [restoreInProgress, setRestoreInProgress] = useState<boolean>(false);
  const [selectedBackup, setSelectedBackup] = useState<string>("");

  // Fetch backups on component mount
  useEffect(() => {
    fetchBackups();
  }, []);

  const fetchBackups = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getBackupsList();

      if (result.success) {
        setBackups(result.backups);
      } else {
        setError(result.message || "Failed to fetch backups");
      }
    } catch (error) {
      console.error("Error fetching backups:", error);
      setError("Failed to fetch backups");
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (backupName: string) => {
    if (restoreInProgress) return;

    // Confirm before restoring
    if (
      !window.confirm(
        `Are you sure you want to restore from backup: ${backupName}? A backup of the current state will be created.`
      )
    ) {
      return;
    }

    try {
      setRestoreInProgress(true);
      setError("");
      setSelectedBackup(backupName);

      const result = await restoreFromBackup(backupName);

      if (result.success) {
        alert(`Successfully restored from backup: ${backupName}`);
        // Pass the restored data to the parent component
        if (onRestoreComplete && result.data) {
          onRestoreComplete(result.data);
        }
        // Refresh the backups list
        await fetchBackups();
      } else {
        setError(result.message || "Failed to restore from backup");
      }
    } catch (error) {
      console.error("Error restoring from backup:", error);
      setError("Failed to restore from backup");
    } finally {
      setRestoreInProgress(false);
      setSelectedBackup("");
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch (error) {
      return dateString;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " bytes";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  // Extract date info from backup name for better display
  const getFormattedBackupName = (name: string) => {
    const match = name.match(
      /component-libraries-(\d{4}-\d{2}-\d{2})-(\d{2}-\d{2}-\d{2})\.bak/
    );
    if (match && match[1] && match[2]) {
      const date = match[1].replace(/-/g, "/");
      const time = match[2].replace(/-/g, ":");
      return `${date} at ${time}`;
    }
    return name;
  };

  return (
    <div className="backup-manager">
      <div className="backup-header">
        <h3>Available Backups</h3>
        <button
          className="refresh-btn"
          onClick={fetchBackups}
          disabled={loading}
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {error && <div className="backup-error">{error}</div>}

      <div className="backups-list">
        {backups.length === 0 ? (
          <div className="no-backups">No backups found</div>
        ) : (
          <table className="backups-table">
            <thead>
              <tr>
                <th>Backup Date</th>
                <th>Created</th>
                <th>Size</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {backups.map((backup) => (
                <tr
                  key={backup.name}
                  className={
                    selectedBackup === backup.name ? "selected-backup" : ""
                  }
                >
                  <td>{getFormattedBackupName(backup.name)}</td>
                  <td>{formatDate(backup.created)}</td>
                  <td>{formatFileSize(backup.size)}</td>
                  <td>
                    <button
                      className="restore-btn"
                      onClick={() => handleRestore(backup.name)}
                      disabled={restoreInProgress}
                    >
                      {restoreInProgress && selectedBackup === backup.name
                        ? "Restoring..."
                        : "Restore"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default BackupManager;
