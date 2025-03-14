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
      className={`component-item ${isDragging ? "dragging" : ""}`}
      draggable={true}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <div className="item-name">{formatName(component.name)}</div>
      <div className="item-price">£{component.basePrice.toLocaleString()}</div>
      {component.allowMultiple && <div className="tag">Multiple allowed</div>}
    </div>
  );
};

export default ComponentCard;
