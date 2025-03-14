import React from "react";
import { useLibraryContext } from "../../context/LibraryContext";

interface LibrarySelectorProps {
  selectedLibrary: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const LibrarySelector: React.FC<LibrarySelectorProps> = ({
  selectedLibrary,
  onChange,
}) => {
  const { libraries, isLoading } = useLibraryContext();

  if (isLoading) {
    return <div className="loading-indicator">Loading libraries...</div>;
  }

  // Function to format library name and ensure AI-B-C is in capitals
  const formatLibraryName = (name: string) => {
    return name.replace(/ai-b-c/i, "AI-B-C");
  };

  return (
    <div className="library-selector-container">
      <div className="library-selector">
        <div>
          <label htmlFor="library-select" className="selector-label">
            Component Library
          </label>
          <select
            id="library-select"
            value={selectedLibrary}
            onChange={onChange}
            className="selector-select form-select"
          >
            {Object.keys(libraries).map((key) => (
              <option key={key} value={key}>
                {formatLibraryName(libraries[key].name)}
              </option>
            ))}
          </select>
        </div>

        <div className="library-description">
          <h3 className="description-title">Description:</h3>
          <p className="description-text">
            {libraries[selectedLibrary]?.description ||
              "No description available"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LibrarySelector;
