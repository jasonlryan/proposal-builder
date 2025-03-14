import React, { useState } from "react";
import { useDragAndDrop } from "../../hooks/useDragAndDrop";

interface ComponentCardProps {
  component: {
    id: string;
    name: string;
    description: string;
    basePrice: number;
    allowMultiple?: boolean;
  };
}

const ComponentCard: React.FC<ComponentCardProps> = ({ component }) => {
  const { handleDragStart, handleDragEnd } = useDragAndDrop();
  const [isDragging, setIsDragging] = useState(false);

  // Function to format component name and ensure AI-B-C is in capitals
  const formatName = (name: string) => {
    return name.replace(/ai-b-c/i, "AI-B-C");
  };

  const onDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    console.log("Starting drag for component:", component.id);
    setIsDragging(true);
    handleDragStart(e, component.id);

    // Add a class to the body to indicate dragging state
    document.body.classList.add("dragging");
  };

  const onDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    console.log("Drag ended for component:", component.id);
    setIsDragging(false);
    handleDragEnd();

    // Remove the dragging state class
    document.body.classList.remove("dragging");
  };

  return (
    <div
      className={`library-component ${isDragging ? "dragging" : ""}`}
      draggable={true}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <div className="component-header">
        <h3 className="component-title">{formatName(component.name)}</h3>
        <div className="component-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 9l4-4 4 4m0 6l-4 4-4-4"
            />
          </svg>
        </div>
      </div>
      <p className="component-description">{component.description}</p>
      <div className="component-footer">
        <span className="component-price">
          £{component.basePrice.toLocaleString()}
        </span>
        {component.allowMultiple && (
          <span className="component-badge">Multiple allowed</span>
        )}
      </div>
    </div>
  );
};

export default ComponentCard;
