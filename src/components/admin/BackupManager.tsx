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
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);

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

  const handleRestoreClick = (backupName: string) => {
    setSelectedBackup(backupName);
    setShowConfirmDialog(true);
  };

  const handleConfirmRestore = async () => {
    if (!selectedBackup) return;

    try {
      setRestoreInProgress(true);
      setError("");

      const result = await restoreFromBackup(selectedBackup);

      if (result.success) {
        alert(`Successfully restored from backup: ${selectedBackup}`);
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
      setShowConfirmDialog(false);
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

  return (
    <div className="backup-manager">
      <div className="backup-header">
        <h3>Backup Manager</h3>
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
                <th>Backup Name</th>
                <th>Created</th>
                <th>Size</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {backups.map((backup) => (
                <tr key={backup.name}>
                  <td>{backup.name}</td>
                  <td>{formatDate(backup.created)}</td>
                  <td>{formatFileSize(backup.size)}</td>
                  <td>
                    <button
                      className="restore-btn"
                      onClick={() => handleRestoreClick(backup.name)}
                      disabled={restoreInProgress}
                    >
                      Restore
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showConfirmDialog && (
        <div className="modal-overlay">
          <div className="modal-content backup-confirm-modal">
            <div className="modal-header">
              <h3>Confirm Restore</h3>
              <button
                className="close-btn"
                onClick={() => setShowConfirmDialog(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <p>
                Are you sure you want to restore from backup: <br />
                <strong>{selectedBackup}</strong>?
              </p>
              <p>
                This will replace the current component library data with the
                backup version. A backup of the current state will be created
                before restoring.
              </p>
            </div>
            <div className="modal-footer">
              <button
                className="cancel-btn"
                onClick={() => setShowConfirmDialog(false)}
                disabled={restoreInProgress}
              >
                Cancel
              </button>
              <button
                className="confirm-restore-btn"
                onClick={handleConfirmRestore}
                disabled={restoreInProgress}
              >
                {restoreInProgress ? "Restoring..." : "Yes, Restore"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BackupManager;
