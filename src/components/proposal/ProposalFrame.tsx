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
    <div
      ref={proposalRef}
      className={`proposal-frame w-full md:w-1/2 border-2 border-dashed ${
        isDragOver ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-white"
      } rounded-lg p-4 md:p-6 min-h-[calc(100vh-280px)] transition-colors duration-200`}
      onDragOver={handleDragOverWithFeedback}
      onDragEnter={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={handleDragLeaveWithFeedback}
      onDrop={handleDropWithFeedback}
    >
      <h2 className="text-lg font-semibold mb-4 text-gray-800 text-center">
        Your Proposal
      </h2>

      {selectedComponents.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          {isDragOver ? (
            <div className="text-blue-500 animate-pulse">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-lg font-medium">Drop to add this component</p>
            </div>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-gray-400 mb-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                />
              </svg>
              <p className="text-gray-500 mb-2">
                Drag components here to build your proposal
              </p>
              <p className="text-sm text-gray-400">
                Components will appear here after you drag them from the library
              </p>
            </>
          )}
        </div>
      )}

      <div className="selected-components space-y-6 overflow-y-auto custom-scrollbar max-h-[calc(100vh-360px)]">
        {selectedComponents.map((component) => (
          <ProposalComponent key={component.instanceId} component={component} />
        ))}
      </div>
    </div>
  );
};

export default ProposalFrame;
