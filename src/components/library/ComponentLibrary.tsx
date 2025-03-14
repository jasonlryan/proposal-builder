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
      <div className="component-library">
        <h2 className="library-title">Loading Components...</h2>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  const description = getCurrentLibraryDescription();

  return (
    <div className="component-library">
      <h2 className="library-title">
        {formatLibraryName(selectedLibrary)} Components
      </h2>
      {description && <p className="component-description">{description}</p>}

      <div className="library-components custom-scrollbar">
        {availableComponents.map((component) => (
          <ComponentCard key={component.id} component={component} />
        ))}
      </div>

      <div className="library-footer">
        <p>Drag components to the center panel to add them to your proposal.</p>
      </div>
    </div>
  );
};

export default ComponentLibrary;
