import React, { useState, useEffect } from "react";
import {
  validateComponent,
  createEmptyComponent,
  createEmptySubElement,
} from "../../utils/schema";
import "../../components/styles/admin.css";
import {
  saveComponentData,
  downloadComponentData,
  getBackupsList,
} from "../../api/fileOps";
import BackupManager from "./BackupManager";

interface Library {
  id: string;
  name: string;
  description: string;
  components: ComponentSchema[];
}

interface ComponentSchema {
  id: string;
  baseId?: string;
  name: string;
  description: string;
  basePrice: number;
  allowMultiple?: boolean;
  subElements: SubElement[];
  metadata?: {
    inputs?: string[];
    tools?: string[];
    outputs?: string[];
    examples?: string[];
  };
}

interface SubElement {
  id: string;
  name: string;
  type: "quantity" | "boolean" | "selection";
  priceImpact: number;
  default?: any;
  min?: number;
  max?: number;
  hasVolumeDiscount?: boolean;
  options?: { value: any; label: string }[];
}

const ComponentEditor: React.FC = () => {
  const [libraries, setLibraries] = useState<Library[]>([]);
  const [selectedLibraryId, setSelectedLibraryId] = useState<string>("");
  const [components, setComponents] = useState<ComponentSchema[]>([]);
  const [selectedComponent, setSelectedComponent] =
    useState<ComponentSchema | null>(null);
  const [jsonView, setJsonView] = useState<boolean>(false);
  const [jsonError, setJsonError] = useState<string>("");
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showSubElementModal, setShowSubElementModal] =
    useState<boolean>(false);
  const [currentSubElement, setCurrentSubElement] = useState<SubElement | null>(
    null
  );
  const [editingSubElementIndex, setEditingSubElementIndex] =
    useState<number>(-1);
  const [showMetadataSection, setShowMetadataSection] =
    useState<boolean>(false);
  const [showBackupModal, setShowBackupModal] = useState<boolean>(false);
  const [backupsCount, setBackupsCount] = useState<number>(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [originalComponent, setOriginalComponent] =
    useState<ComponentSchema | null>(null);

  // Fetch component libraries from JSON file
  useEffect(() => {
    const fetchLibraries = async () => {
      try {
        setLoading(true);
        const response = await fetch("/assets/component-libraries.json");
        const data = await response.json();

        // Convert the object structure to an array for easier manipulation
        if (data && data.componentLibraries) {
          const librariesArray = Object.entries(data.componentLibraries).map(
            ([id, libraryData]: [string, any]) => ({
              id,
              name: libraryData.name,
              description: libraryData.description,
              components: libraryData.components,
            })
          );

          setLibraries(librariesArray);

          // Set first library as default if available
          if (librariesArray.length > 0) {
            setSelectedLibraryId(librariesArray[0].id);
          }
        }
      } catch (error) {
        console.error("Error loading component libraries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLibraries();
  }, []);

  // Update components when selected library changes
  useEffect(() => {
    if (selectedLibraryId) {
      const selectedLib = libraries.find((lib) => lib.id === selectedLibraryId);
      if (selectedLib) {
        setComponents(selectedLib.components || []);
        setSelectedComponent(null); // Reset selected component when library changes
      }
    }
  }, [selectedLibraryId, libraries]);

  // Add a method to fetch backups count
  useEffect(() => {
    const fetchBackupsCount = async () => {
      try {
        const result = await getBackupsList();
        if (result.success) {
          setBackupsCount(result.backups.length);
        }
      } catch (error) {
        console.error("Error fetching backups count:", error);
      }
    };

    fetchBackupsCount();
    // Set up a timer to periodically check for new backups
    const intervalId = setInterval(fetchBackupsCount, 30000); // Check every 30 seconds

    return () => clearInterval(intervalId);
  }, []);

  const handleLibraryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLibraryId(e.target.value);
  };

  const handleComponentSelect = (component: ComponentSchema) => {
    setOriginalComponent(JSON.parse(JSON.stringify(component)));
    setSelectedComponent(component);
    setJsonError("");
    setValidationErrors([]);
    setShowMetadataSection(!!component.metadata);
  };

  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    try {
      const parsed = JSON.parse(e.target.value);
      setSelectedComponent(parsed);
      setJsonError("");
      setShowMetadataSection(!!parsed.metadata);

      // Validate the component
      const { errors } = validateComponent(parsed);
      setValidationErrors(errors);
    } catch (error) {
      setJsonError("Invalid JSON: " + (error as Error).message);
    }
  };

  const handleCreateNewComponent = () => {
    if (!selectedLibraryId) return;

    const newComponent = createEmptyComponent(selectedLibraryId);
    setComponents((prev) => [...prev, newComponent]);
    setSelectedComponent(newComponent);
    setValidationErrors([]);
    setJsonError("");
    setShowMetadataSection(false);
  };

  const handleSave = async () => {
    if (!selectedComponent) return;

    // Validate before saving
    const { isValid, errors } = validateComponent(selectedComponent);
    setValidationErrors(errors);

    if (!isValid) {
      alert("Please fix validation errors before saving");
      return;
    }

    // Update the component in the local state
    const updatedComponents = components.map((comp) =>
      comp.id === selectedComponent.id ? selectedComponent : comp
    );
    setComponents(updatedComponents);

    // Find the current library
    const currentLibrary = libraries.find(
      (lib) => lib.id === selectedLibraryId
    );
    if (!currentLibrary) {
      alert("Library not found");
      return;
    }

    // Create the updated library data
    const updatedLibrary = {
      ...currentLibrary,
      components: updatedComponents,
    };

    // Create the full updated component libraries object
    const updatedData = {
      componentLibraries: {
        ...libraries.reduce<Record<string, Library>>((acc, lib) => {
          if (lib.id === selectedLibraryId) {
            acc[lib.id] = updatedLibrary;
          } else {
            acc[lib.id] = lib;
          }
          return acc;
        }, {}),
      },
    };

    try {
      // Try to save to the server
      const result = await saveComponentData(updatedData);

      if (result.success) {
        alert(
          `Component saved successfully! ${
            result.backupCreated ? `Backup created: ${result.backupName}` : ""
          }`
        );

        // Refresh backups count after successful save
        const backupsResult = await getBackupsList();
        if (backupsResult.success) {
          setBackupsCount(backupsResult.backups.length);
        }
      } else {
        // If server-side save fails, offer to download the file
        if (
          window.confirm(
            "Failed to save to server. Would you like to download the updated JSON file instead?"
          )
        ) {
          downloadComponentData(updatedData);
        }
      }
    } catch (error) {
      console.error("Error saving component data:", error);
      // Offer to download as a fallback
      if (
        window.confirm(
          "Error saving to server. Would you like to download the updated JSON file instead?"
        )
      ) {
        downloadComponentData(updatedData);
      }
    }
  };

  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    if (!selectedComponent) return;

    const { name, value, type } = e.target;
    const newValue =
      type === "number"
        ? parseFloat(value)
        : type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : value;

    const updatedComponent = {
      ...selectedComponent,
      [name]: newValue,
    };

    setSelectedComponent(updatedComponent);

    // Validate on change
    const { errors } = validateComponent(updatedComponent);
    setValidationErrors(errors);
  };

  const handleMetadataChange = (
    field: "inputs" | "tools" | "outputs" | "examples",
    value: string
  ) => {
    if (!selectedComponent) return;

    // Split the textarea value by newlines to create an array
    const valueArray = value.split("\n").filter((item) => item.trim() !== "");

    const updatedMetadata = {
      ...(selectedComponent.metadata || {}),
      [field]: valueArray,
    };

    const updatedComponent = {
      ...selectedComponent,
      metadata: updatedMetadata,
    };

    setSelectedComponent(updatedComponent);
  };

  const handleAddMetadataSection = () => {
    if (!selectedComponent) return;

    const updatedComponent = {
      ...selectedComponent,
      metadata: {
        inputs: [],
        tools: [],
        outputs: [],
        examples: [],
      },
    };

    setSelectedComponent(updatedComponent);
    setShowMetadataSection(true);
  };

  const handleAddSubElement = () => {
    setCurrentSubElement(createEmptySubElement("quantity"));
    setEditingSubElementIndex(-1);
    setShowSubElementModal(true);
  };

  const handleEditSubElement = (element: SubElement, index: number) => {
    setCurrentSubElement({ ...element });
    setEditingSubElementIndex(index);
    setShowSubElementModal(true);
  };

  const handleRemoveSubElement = (index: number) => {
    if (!selectedComponent) return;

    const newSubElements = [...selectedComponent.subElements];
    newSubElements.splice(index, 1);

    const updatedComponent = {
      ...selectedComponent,
      subElements: newSubElements,
    };

    setSelectedComponent(updatedComponent);

    // Validate after removing
    const { errors } = validateComponent(updatedComponent);
    setValidationErrors(errors);
  };

  const handleSaveSubElement = (element: SubElement) => {
    if (!selectedComponent || !element) return;

    let newSubElements;

    if (editingSubElementIndex >= 0) {
      // Update existing sub-element
      newSubElements = [...selectedComponent.subElements];
      newSubElements[editingSubElementIndex] = element;
    } else {
      // Add new sub-element
      newSubElements = [...selectedComponent.subElements, element];
    }

    const updatedComponent = {
      ...selectedComponent,
      subElements: newSubElements,
    };

    setSelectedComponent(updatedComponent);
    setShowSubElementModal(false);

    // Validate after saving
    const { errors } = validateComponent(updatedComponent);
    setValidationErrors(errors);
  };

  // SubElement Editor Modal Component
  const SubElementModal = () => {
    // Always initialize the state first, before any conditionals
    const defaultElement = createEmptySubElement("quantity");
    const [element, setElement] = useState<SubElement>(
      currentSubElement || defaultElement
    );

    // Now we can safely have conditionals
    if (!currentSubElement) return null;

    const handleElementChange = (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      const { name, value, type } = e.target;
      const newValue =
        type === "number"
          ? parseFloat(value)
          : type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : value;

      setElement({
        ...element,
        [name]: newValue,
      });
    };

    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newType = e.target.value as "quantity" | "boolean" | "selection";

      // Create a new sub-element of the selected type
      // This ensures it has the correct properties for that type
      const newElement = createEmptySubElement(newType);

      // Preserve existing id and name
      setElement({
        ...newElement,
        id: element.id,
        name: element.name,
      });
    };

    const handleAddOption = () => {
      if (!element.options) {
        setElement({
          ...element,
          options: [],
        });
        return;
      }

      setElement({
        ...element,
        options: [
          ...element.options,
          {
            value: `option${element.options.length + 1}`,
            label: `Option ${element.options.length + 1}`,
          },
        ],
      });
    };

    const handleOptionChange = (
      index: number,
      field: "value" | "label",
      value: string
    ) => {
      if (!element.options) return;

      const newOptions = [...element.options];
      newOptions[index] = {
        ...newOptions[index],
        [field]: value,
      };

      setElement({
        ...element,
        options: newOptions,
      });
    };

    const handleRemoveOption = (index: number) => {
      if (!element.options) return;

      const newOptions = [...element.options];
      newOptions.splice(index, 1);

      setElement({
        ...element,
        options: newOptions,
      });
    };

    return (
      <div className="modal-overlay">
        <div className="modal-content" style={{ maxWidth: "700px" }}>
          <div className="modal-header">
            <h3>{editingSubElementIndex >= 0 ? "Edit" : "Add"} Sub-Element</h3>
            <button
              className="close-btn"
              onClick={() => setShowSubElementModal(false)}
              aria-label="Close"
            >
              ×
            </button>
          </div>

          <div className="modal-body">
            <div className="form-row">
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={element.name}
                  onChange={handleElementChange}
                  placeholder="Enter element name"
                />
                <div className="field-hint">
                  Descriptive name for this configuration option
                </div>
              </div>

              <div className="form-group">
                <label>Type:</label>
                <select
                  name="type"
                  value={element.type}
                  onChange={handleTypeChange}
                >
                  <option value="quantity">Quantity (number)</option>
                  <option value="boolean">Boolean (on/off)</option>
                  <option value="selection">Selection (dropdown)</option>
                </select>
                <div className="field-hint">
                  Determines how this option behaves in the proposal
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Price Impact:</label>
              <input
                type="number"
                name="priceImpact"
                value={element.priceImpact}
                onChange={handleElementChange}
                placeholder="0"
              />
              <div className="field-hint">
                How this element affects the component's price
              </div>
            </div>

            {element.type === "quantity" && (
              <>
                <div className="form-row">
                  <div className="form-group">
                    <label>Default Value:</label>
                    <input
                      type="number"
                      name="default"
                      value={element.default || 0}
                      onChange={handleElementChange}
                      placeholder="0"
                    />
                  </div>

                  <div className="form-group checkbox">
                    <label>
                      <input
                        type="checkbox"
                        name="hasVolumeDiscount"
                        checked={element.hasVolumeDiscount || false}
                        onChange={handleElementChange}
                      />
                      Enable Volume Discount
                    </label>
                    <div className="field-hint">
                      Apply discount for higher quantities
                    </div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Minimum Value:</label>
                    <input
                      type="number"
                      name="min"
                      value={element.min || 0}
                      onChange={handleElementChange}
                      placeholder="0"
                    />
                  </div>

                  <div className="form-group">
                    <label>Maximum Value:</label>
                    <input
                      type="number"
                      name="max"
                      value={element.max || 0}
                      onChange={handleElementChange}
                      placeholder="0"
                    />
                    <div className="field-hint">Leave at 0 for unlimited</div>
                  </div>
                </div>
              </>
            )}

            {element.type === "boolean" && (
              <div className="form-group checkbox">
                <label>
                  <input
                    type="checkbox"
                    name="default"
                    checked={element.default || false}
                    onChange={handleElementChange}
                  />
                  Default Value (checked/unchecked)
                </label>
                <div className="field-hint">
                  Whether this option is checked by default
                </div>
              </div>
            )}

            {element.type === "selection" && (
              <div className="form-group">
                <label>Options:</label>
                <div className="field-hint">
                  Define the choices available in the dropdown
                </div>
                <div
                  className="options-list"
                  style={{ maxHeight: "200px", overflowY: "auto" }}
                >
                  {element.options && element.options.length > 0 ? (
                    element.options.map((option, index) => (
                      <div key={index} className="option-item">
                        <input
                          type="text"
                          placeholder="Value"
                          value={option.value}
                          onChange={(e) =>
                            handleOptionChange(index, "value", e.target.value)
                          }
                        />
                        <input
                          type="text"
                          placeholder="Label"
                          value={option.label}
                          onChange={(e) =>
                            handleOptionChange(index, "label", e.target.value)
                          }
                        />
                        <button
                          type="button"
                          className="remove-option-btn"
                          onClick={() => handleRemoveOption(index)}
                          aria-label="Remove option"
                        >
                          ×
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="empty-list-message">
                      No options defined. Add your first option below.
                    </div>
                  )}

                  <button
                    type="button"
                    className="add-option-btn"
                    onClick={handleAddOption}
                  >
                    Add Option
                  </button>
                </div>

                <div className="form-group">
                  <label>Default Value:</label>
                  <select
                    name="default"
                    value={element.default || ""}
                    onChange={handleElementChange}
                  >
                    <option value="">Select a default</option>
                    {element.options &&
                      element.options.map((option, index) => (
                        <option key={index} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                  </select>
                  <div className="field-hint">
                    Which option is selected by default
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button
              className="cancel-btn"
              onClick={() => setShowSubElementModal(false)}
            >
              Cancel
            </button>
            <button
              className="save-btn"
              onClick={() => handleSaveSubElement(element)}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Add a method to handle data restoration
  const handleRestoreData = (restoredData: any) => {
    if (!restoredData || !restoredData.componentLibraries) {
      alert("Invalid restored data format");
      return;
    }

    // Convert the restored data back to our library array format
    const restoredLibraries = Object.entries(
      restoredData.componentLibraries
    ).map(([id, libraryData]: [string, any]) => ({
      id,
      name: libraryData.name,
      description: libraryData.description,
      components: libraryData.components,
    }));

    // Update the libraries state
    setLibraries(restoredLibraries);

    // Reset the selected component
    setSelectedComponent(null);

    // If the current library still exists, update its components
    const currentLib = restoredLibraries.find(
      (lib) => lib.id === selectedLibraryId
    );
    if (currentLib) {
      setComponents(currentLib.components || []);
    } else if (restoredLibraries.length > 0) {
      // If current library doesn't exist anymore, select the first one
      setSelectedLibraryId(restoredLibraries[0].id);
      setComponents(restoredLibraries[0].components || []);
    } else {
      // If no libraries exist
      setComponents([]);
    }
  };

  // Handle cancel - just clear the editor
  const handleCancel = () => {
    if (selectedComponent) {
      // Confirm with user if they want to close the editor
      if (
        window.confirm("Close the editor? Any unsaved changes will be lost.")
      ) {
        // Clear the selected component (but don't remove from library)
        setSelectedComponent(null);
        setValidationErrors([]);
        setJsonError("");
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading component libraries...</div>;
  }

  return (
    <div className="component-editor">
      <div className="editor-header">
        <h2>Component Editor (Admin)</h2>
        <p>Edit and manage component library definitions</p>
      </div>

      <main className="flex-grow">
        <div className="editor-layout three-column">
          {/* Left Sidebar */}
          <div className="editor-sidebar">
            <div className="panel-header">
              <h3>Library Selection</h3>
            </div>
            <div className="library-selector-container">
              <div className="form-group library-select-group">
                <label>Component Library:</label>
                <select
                  value={selectedLibraryId}
                  onChange={handleLibraryChange}
                  className="library-select"
                >
                  {libraries.map((lib) => (
                    <option key={lib.id} value={lib.id}>
                      {lib.name}
                    </option>
                  ))}
                </select>
              </div>
              <button className="action-btn add-library-btn">
                <span className="btn-icon">+</span>
                <span className="btn-text">Add New Library</span>
              </button>
            </div>

            <div className="component-list">
              <div className="list-header">
                <h3>Components</h3>
                <button
                  className="action-btn add-component-btn"
                  onClick={handleCreateNewComponent}
                >
                  <span className="btn-icon">+</span>
                  <span className="btn-text">New</span>
                </button>
              </div>

              <div className="component-items">
                {components.length === 0 ? (
                  <div className="empty-list-message">
                    No components available in this library
                  </div>
                ) : (
                  components.map((component) => (
                    <div
                      key={component.id}
                      className={`component-item ${
                        selectedComponent?.id === component.id ? "selected" : ""
                      }`}
                      onClick={() => handleComponentSelect(component)}
                    >
                      <div className="item-name">{component.name}</div>
                      <div className="item-price">£{component.basePrice}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Middle column - Edit form or JSON view */}
          <div className="editor-main">
            {selectedComponent ? (
              <>
                <div className="editor-toolbar">
                  <div className="view-toggle-group">
                    <button
                      className={`view-toggle ${jsonView ? "" : "active"}`}
                      onClick={() => setJsonView(false)}
                    >
                      <span className="icon">📝</span> Form View
                    </button>
                    <button
                      className={`view-toggle ${jsonView ? "active" : ""}`}
                      onClick={() => setJsonView(true)}
                    >
                      <span className="icon">{}</span> JSON View
                    </button>
                  </div>
                  <div className="toolbar-actions">
                    <button className="cancel-btn" onClick={handleCancel}>
                      Close Editor
                    </button>
                    <button className="save-btn" onClick={handleSave}>
                      Save Changes
                    </button>
                  </div>
                </div>

                {validationErrors.length > 0 && (
                  <div className="validation-errors">
                    <h4>Validation Errors:</h4>
                    <ul>
                      {validationErrors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {jsonView ? (
                  <div className="json-editor">
                    <textarea
                      value={JSON.stringify(selectedComponent, null, 2)}
                      onChange={handleJsonChange}
                      className="json-textarea"
                      spellCheck="false"
                    />
                    {jsonError && <div className="json-error">{jsonError}</div>}
                  </div>
                ) : (
                  <div className="form-editor">
                    <div className="form-section">
                      <h3>Basic Information</h3>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Component ID:</label>
                          <input
                            type="text"
                            name="id"
                            value={selectedComponent.id}
                            onChange={handleFormChange}
                            disabled
                          />
                          <div className="field-hint">
                            Unique identifier (auto-generated)
                          </div>
                        </div>

                        <div className="form-group">
                          <label>Base ID:</label>
                          <input
                            type="text"
                            name="baseId"
                            value={selectedComponent.baseId || ""}
                            onChange={handleFormChange}
                          />
                          <div className="field-hint">
                            Used for component type identification
                          </div>
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label>Name:</label>
                          <input
                            type="text"
                            name="name"
                            value={selectedComponent.name}
                            onChange={handleFormChange}
                          />
                        </div>

                        <div className="form-group">
                          <label>Base Price (£):</label>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                            }}
                          >
                            <input
                              type="number"
                              name="basePrice"
                              value={selectedComponent.basePrice}
                              onChange={handleFormChange}
                              style={{ flex: "1" }}
                            />
                            <div className="checkbox-wrapper">
                              <input
                                type="checkbox"
                                id="allowMultiple"
                                name="allowMultiple"
                                checked={
                                  selectedComponent.allowMultiple || false
                                }
                                onChange={handleFormChange}
                              />
                              <label htmlFor="allowMultiple">Multiple</label>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="form-group">
                        <label>Description:</label>
                        <textarea
                          name="description"
                          value={selectedComponent.description}
                          onChange={handleFormChange}
                          className="enhanced-textarea"
                          placeholder="Enter a detailed description of the component..."
                          rows={6}
                        />
                        <div className="field-hint">
                          Provide a clear, detailed description of this
                          component's purpose and what it delivers.
                          {selectedComponent.description && (
                            <span className="character-count">
                              {selectedComponent.description.length} characters
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="form-section">
                      <div className="section-header">
                        <h3>Sub Elements</h3>
                        <button
                          className="add-element-btn"
                          onClick={handleAddSubElement}
                        >
                          + Add Element
                        </button>
                      </div>

                      <div className="sub-elements-list">
                        {selectedComponent.subElements.length === 0 ? (
                          <div className="empty-list-message">
                            No sub-elements defined. Click "Add Element" to
                            create one.
                          </div>
                        ) : (
                          selectedComponent.subElements.map(
                            (element, index) => (
                              <div
                                key={element.id}
                                className="sub-element-item"
                              >
                                <div className="element-header">
                                  <h4>{element.name}</h4>
                                  <div className="element-actions">
                                    <button
                                      className="edit-element-btn"
                                      onClick={() =>
                                        handleEditSubElement(element, index)
                                      }
                                    >
                                      Edit
                                    </button>
                                    <button
                                      className="remove-element-btn"
                                      onClick={() =>
                                        handleRemoveSubElement(index)
                                      }
                                    >
                                      Remove
                                    </button>
                                  </div>
                                </div>

                                <div className="element-details">
                                  <div>Type: {element.type}</div>
                                  <div>
                                    Price Impact: £{element.priceImpact}
                                  </div>
                                  {element.hasVolumeDiscount && (
                                    <div className="tag">Volume Discount</div>
                                  )}
                                  {element.type === "selection" && (
                                    <div>
                                      Options: {element.options?.length || 0}
                                    </div>
                                  )}
                                  {element.type === "quantity" && (
                                    <div>
                                      Range: {element.min || 0} -{" "}
                                      {element.max || "∞"}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )
                          )
                        )}
                      </div>
                    </div>

                    {showMetadataSection ? (
                      <div className="form-section">
                        <div className="section-header">
                          <h3>Metadata</h3>
                        </div>

                        <div
                          className="metadata-inputs"
                          style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(3, 1fr)",
                            gap: "1rem",
                          }}
                        >
                          <div className="form-group">
                            <label>Inputs:</label>
                            <textarea
                              value={
                                selectedComponent.metadata?.inputs?.join(
                                  "\n"
                                ) || ""
                              }
                              onChange={(e) =>
                                handleMetadataChange("inputs", e.target.value)
                              }
                              placeholder="Enter each input on a new line"
                              className="metadata-textarea"
                              rows={5}
                            />
                          </div>

                          <div className="form-group">
                            <label>Tools:</label>
                            <textarea
                              value={
                                selectedComponent.metadata?.tools?.join("\n") ||
                                ""
                              }
                              onChange={(e) =>
                                handleMetadataChange("tools", e.target.value)
                              }
                              placeholder="Enter each tool on a new line"
                              className="metadata-textarea"
                              rows={5}
                            />
                          </div>

                          <div className="form-group">
                            <label>Outputs:</label>
                            <textarea
                              value={
                                selectedComponent.metadata?.outputs?.join(
                                  "\n"
                                ) || ""
                              }
                              onChange={(e) =>
                                handleMetadataChange("outputs", e.target.value)
                              }
                              placeholder="Enter each output on a new line"
                              className="metadata-textarea"
                              rows={5}
                            />
                          </div>

                          <div
                            className="form-group"
                            style={{ gridColumn: "1 / -1" }}
                          >
                            <label>Examples:</label>
                            <textarea
                              value={
                                selectedComponent.metadata?.examples?.join(
                                  "\n"
                                ) || ""
                              }
                              onChange={(e) =>
                                handleMetadataChange("examples", e.target.value)
                              }
                              placeholder="Enter each example on a new line"
                              className="metadata-textarea"
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="form-section">
                        <button
                          className="add-metadata-btn"
                          onClick={handleAddMetadataSection}
                        >
                          + Add Metadata
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="no-selection">
                <p>Select a component to edit or create a new one</p>
              </div>
            )}
          </div>

          {/* Right column - Component preview */}
          <div className="preview-panel">
            <div className="panel-header">
              <h3>Component Preview</h3>
            </div>
            {selectedComponent ? (
              <div className="preview-component">
                <div className="preview-header">
                  <div className="preview-title">{selectedComponent.name}</div>
                  {selectedComponent.allowMultiple && (
                    <div className="preview-tag">Multiple allowed</div>
                  )}
                </div>
                <div className="preview-description">
                  {selectedComponent.description}
                </div>
                <div className="preview-price">
                  From £{selectedComponent.basePrice}
                </div>

                {/* Display metadata if available */}
                {selectedComponent.metadata && (
                  <div className="preview-metadata">
                    {selectedComponent.metadata.inputs &&
                      selectedComponent.metadata.inputs.length > 0 && (
                        <div className="metadata-section">
                          <h4>Inputs:</h4>
                          <ul>
                            {selectedComponent.metadata.inputs.map(
                              (input, index) => (
                                <li key={index}>{input}</li>
                              )
                            )}
                          </ul>
                        </div>
                      )}

                    {selectedComponent.metadata.tools &&
                      selectedComponent.metadata.tools.length > 0 && (
                        <div className="metadata-section">
                          <h4>Tools:</h4>
                          <ul>
                            {selectedComponent.metadata.tools.map(
                              (tool, index) => (
                                <li key={index}>{tool}</li>
                              )
                            )}
                          </ul>
                        </div>
                      )}

                    {selectedComponent.metadata.outputs &&
                      selectedComponent.metadata.outputs.length > 0 && (
                        <div className="metadata-section">
                          <h4>Outputs:</h4>
                          <ul>
                            {selectedComponent.metadata.outputs.map(
                              (output, index) => (
                                <li key={index}>{output}</li>
                              )
                            )}
                          </ul>
                        </div>
                      )}

                    {selectedComponent.metadata.examples &&
                      selectedComponent.metadata.examples.length > 0 && (
                        <div className="metadata-section">
                          <h4>Examples:</h4>
                          <ul>
                            {selectedComponent.metadata.examples.map(
                              (example, index) => (
                                <li key={index}>{example}</li>
                              )
                            )}
                          </ul>
                        </div>
                      )}
                  </div>
                )}
              </div>
            ) : (
              <div className="empty-preview-message">
                <span>Select or create a component to see a preview</span>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="editor-footer">
        <p>Component Editor © {new Date().getFullYear()}</p>
      </footer>

      <div className="editor-help-note">
        <strong>Tip:</strong> Use the Form View for a guided editing experience
        or JSON View for advanced editing. Component changes are only saved when
        you click "Save Changes".
        {backupsCount > 0 && (
          <button
            className="restore-from-backup-btn"
            onClick={() => setShowBackupModal(true)}
          >
            Restore from Backup ({backupsCount})
          </button>
        )}
      </div>

      {showBackupModal && (
        <div className="modal-overlay">
          <div className="modal-content backup-modal">
            <div className="modal-header">
              <h3>Backup Manager</h3>
              <button
                className="close-btn"
                onClick={() => setShowBackupModal(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <BackupManager
                onRestoreComplete={(restoredData) => {
                  handleRestoreData(restoredData);
                  setShowBackupModal(false);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {showSubElementModal && <SubElementModal />}
    </div>
  );
};

export default ComponentEditor;
