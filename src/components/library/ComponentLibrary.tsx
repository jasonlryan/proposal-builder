import React from "react";
import { useLibraryContext } from "../../context/LibraryContext";
import { useComponentLibrary } from "../../hooks/useComponentLibrary";
import ComponentCard from "./ComponentCard";

const ComponentLibrary: React.FC = () => {
  const { selectedLibrary, availableComponents, isLoading } =
    useLibraryContext();
  const { getCurrentLibraryDescription } = useComponentLibrary();

  // Function to format library name and ensure AI-B-C is in capitals
  const formatLibraryName = (name: string) => {
    return name.replace(/ai-b-c/i, "AI-B-C");
  };

  if (isLoading) {
    return (
      <div className="component-list">
        <div className="list-header">
          <h3>Components</h3>
        </div>
        <div className="animate-pulse space-y-4 p-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const description = getCurrentLibraryDescription();

  return (
    <div className="component-list">
      <div className="list-header">
        <h3>Components</h3>
      </div>
      <div className="component-items custom-scrollbar">
        {availableComponents.length > 0 ? (
          availableComponents.map((component) => (
            <ComponentCard key={component.id} component={component} />
          ))
        ) : (
          <div className="empty-list-message">
            No components available in this library
          </div>
        )}
      </div>
    </div>
  );
};

export default ComponentLibrary;
