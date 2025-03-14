import React, { useState, useEffect } from "react";
import { useDragAndDrop } from "../../hooks/useDragAndDrop";
import { useProposalContext } from "../../context/ProposalContext";
import ProposalComponent from "./ProposalComponent";

const ProposalFrame: React.FC = () => {
  const { proposalRef, handleDragOver, handleDragLeave, handleDrop } =
    useDragAndDrop();
  const { selectedComponents } = useProposalContext();
  const [isDragOver, setIsDragOver] = useState(false);
  // const [isDraggingInDocument, setIsDraggingInDocument] = useState(false);

  useEffect(() => {
    const handleBodyDragEnter = () => {
      // setIsDraggingInDocument(true);
    };

    const handleBodyDragLeave = (e: DragEvent) => {
      if (!e.relatedTarget) {
        // setIsDraggingInDocument(false);
      }
    };

    document.body.addEventListener("dragenter", handleBodyDragEnter);
    document.body.addEventListener("dragleave", handleBodyDragLeave);

    return () => {
      document.body.removeEventListener("dragenter", handleBodyDragEnter);
      document.body.removeEventListener("dragleave", handleBodyDragLeave);
    };
  }, []);

  const handleDragOverWithFeedback = (e: React.DragEvent<HTMLDivElement>) => {
    console.log("Drag over event on proposal frame");
    handleDragOver(e);
    setIsDragOver(true);
  };

  const handleDragLeaveWithFeedback = (e: React.DragEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      console.log("Drag leave event on proposal frame");
      handleDragLeave(e);
      setIsDragOver(false);
    }
  };

  const handleDropWithFeedback = (e: React.DragEvent<HTMLDivElement>) => {
    console.log("Drop event on proposal frame");
    handleDrop(e);
    setIsDragOver(false);
    // setIsDraggingInDocument(false);
  };

  return (
    <div className="editor-main">
      <div className="panel-header">
        <h3>Your Proposal</h3>
      </div>

      <div
        ref={proposalRef}
        className={`proposal-content ${isDragOver ? "drag-over" : ""}`}
        onDragOver={handleDragOverWithFeedback}
        onDragEnter={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={handleDragLeaveWithFeedback}
        onDrop={handleDropWithFeedback}
        style={{
          transition: "all 0.2s",
          backgroundColor: isDragOver ? "#EFF6FF" : "#FFFFFF",
          border: isDragOver ? "2px dashed #3B82F6" : "2px dashed #E5E7EB",
          minHeight: "calc(100vh - 280px)",
          padding: "1rem",
          borderRadius: "0.5rem",
          margin: "1rem",
        }}
      >
        {selectedComponents.length === 0 ? (
          <div className="empty-preview-message">
            {isDragOver ? (
              <div style={{ textAlign: "center", color: "#3B82F6" }}>
                <p
                  style={{
                    fontSize: "1.125rem",
                    fontWeight: "500",
                    marginBottom: "0.5rem",
                  }}
                >
                  Drop to add this component
                </p>
              </div>
            ) : (
              <span>Drag components here to build your proposal</span>
            )}
          </div>
        ) : (
          <div
            className="selected-components"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              overflowY: "auto",
              maxHeight: "calc(100vh - 360px)",
            }}
          >
            {selectedComponents.map((component) => (
              <ProposalComponent
                key={component.instanceId}
                component={component}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProposalFrame;
