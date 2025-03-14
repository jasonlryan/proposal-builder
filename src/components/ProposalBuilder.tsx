import React, { useState } from "react";
import { useLibraryContext } from "../context/LibraryContext";
import { useProposalContext } from "../context/ProposalContext";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { usePricing } from "../hooks/usePricing";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useDragAndDrop } from "../hooks/useDragAndDrop";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import LibrarySelector from "./library/LibrarySelector";
import ComponentLibrary from "./library/ComponentLibrary";
import ProposalFrame from "./proposal/ProposalFrame";
import ProposalSummary from "./summary/ProposalSummary";
import PreviewModal from "./modals/PreviewModal";
import PublishModal from "./modals/PublishModal";
import ConfirmationModal from "./modals/ConfirmationModal";
import "../components/styles/admin.css";

const ProposalBuilder: React.FC = () => {
  const {
    selectedLibrary,
    setSelectedLibrary,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    availableComponents,
    libraries,
  } = useLibraryContext();
  const {
    selectedComponents,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setSelectedComponents,
    modalVisible,
    setModalVisible,
    publishModalVisible,
    setPublishModalVisible,
    switchLibraryModalVisible,
    setSwitchLibraryModalVisible,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    pendingLibraryChange,
    setPendingLibraryChange,
    confirmLibraryChange,
    cancelLibraryChange,
  } = useProposalContext();

  const [publishUrl, setPublishUrl] = useState<string>("");

  // Handle library change with confirmation if needed
  const handleLibraryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLibrary = e.target.value;
    console.log("Library change requested to:", newLibrary);

    if (selectedComponents.length > 0) {
      console.log("Selected components exist, showing confirmation modal");
      setPendingLibraryChange(newLibrary);
      setSwitchLibraryModalVisible(true);
    } else {
      console.log("No selected components, changing library directly");
      setSelectedLibrary(newLibrary);
    }
  };

  // Toggle preview modal
  const toggleProposalModal = () => {
    setModalVisible(!modalVisible);
  };

  // Toggle publish modal
  const togglePublishModal = () => {
    setPublishModalVisible(!publishModalVisible);
  };

  // Handle URL change for publishing
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPublishUrl(e.target.value);
  };

  // Publish proposal to URL
  const publishToUrl = () => {
    // Implementation would depend on backend API
    alert(`Proposal would be published to: ${publishUrl}`);
    setPublishModalVisible(false);
  };

  // Download proposal in specified format
  const downloadProposal = (format: "pdf" | "word" | "json") => {
    // Implementation would depend on export service
    alert(`Downloading proposal in ${format.toUpperCase()} format`);
    setModalVisible(false);
  };

  return (
    <div className="component-editor">
      <div className="editor-header">
        <h2>Proposal Builder</h2>
        <p>
          Create and customize proposals by adding components from the library
        </p>
      </div>

      <main className="flex-grow">
        <div className="editor-layout three-column">
          <div className="editor-sidebar">
            <div className="panel-header">
              <h3>Library Selection</h3>
            </div>
            <div className="library-selector-container">
              <div className="form-group library-select-group">
                <label>Component Library:</label>
                <select
                  value={selectedLibrary}
                  onChange={handleLibraryChange}
                  className="library-select"
                >
                  {/* Dynamically load libraries instead of hardcoding */}
                  {Object.entries(libraries).map(([id, lib]) => (
                    <option key={id} value={id}>
                      {lib.name}
                    </option>
                  ))}
                </select>
              </div>
              {/* "Add New Library" button removed as it's available in Editor */}
            </div>
            <ComponentLibrary />
          </div>
          <ProposalFrame />
          <ProposalSummary
            onPreview={toggleProposalModal}
            onPublish={togglePublishModal}
          />
        </div>
      </main>

      <footer className="editor-footer">
        <p>Proposal Builder © {new Date().getFullYear()}</p>
      </footer>

      {modalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <PreviewModal
            onClose={toggleProposalModal}
            onDownload={downloadProposal}
          />
        </div>
      )}

      {publishModalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <PublishModal
            url={publishUrl}
            onUrlChange={handleUrlChange}
            onPublish={publishToUrl}
            onClose={togglePublishModal}
          />
        </div>
      )}

      {switchLibraryModalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <ConfirmationModal
            title="Change Component Library?"
            message="Changing libraries will remove all current components. Continue?"
            onConfirm={confirmLibraryChange}
            onCancel={cancelLibraryChange}
          />
        </div>
      )}
    </div>
  );
};

export default ProposalBuilder;
