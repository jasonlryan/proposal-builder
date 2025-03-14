import React, { createContext, useContext, useState, ReactNode } from "react";
import { v4 as uuidv4 } from "uuid";
import { useLibraryContext } from "./LibraryContext";

// Define types for our context
export interface ProposalComponent {
  componentId: string;
  instanceId: string;
  baseId: string;
  name: string;
  description: string;
  basePrice: number;
  subElements: ProposalSubElement[];
}

export interface ProposalSubElement {
  id: string;
  name: string;
  type: "quantity" | "boolean" | "selection";
  priceImpact: number;
  value: any;
  min?: number;
  max?: number;
  hasVolumeDiscount?: boolean;
  options?: { value: any; label: string }[];
}

interface ProposalContextType {
  selectedComponents: ProposalComponent[];
  setSelectedComponents: React.Dispatch<
    React.SetStateAction<ProposalComponent[]>
  >;
  addComponent: (componentId: string) => void;
  removeComponent: (instanceId: string) => void;
  updateSubElementValue: (
    instanceId: string,
    subElementId: string,
    newValue: any
  ) => void;
  incrementSubElement: (instanceId: string, subElementId: string) => void;
  decrementSubElement: (instanceId: string, subElementId: string) => void;
  modalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  publishModalVisible: boolean;
  setPublishModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  switchLibraryModalVisible: boolean;
  setSwitchLibraryModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  pendingLibraryChange: string | null;
  setPendingLibraryChange: React.Dispatch<React.SetStateAction<string | null>>;
  confirmLibraryChange: () => void;
  cancelLibraryChange: () => void;
}

// Create the context with default values
const ProposalContext = createContext<ProposalContextType>({
  selectedComponents: [],
  setSelectedComponents: () => {},
  addComponent: () => {},
  removeComponent: () => {},
  updateSubElementValue: () => {},
  incrementSubElement: () => {},
  decrementSubElement: () => {},
  modalVisible: false,
  setModalVisible: () => {},
  publishModalVisible: false,
  setPublishModalVisible: () => {},
  switchLibraryModalVisible: false,
  setSwitchLibraryModalVisible: () => {},
  pendingLibraryChange: null,
  setPendingLibraryChange: () => {},
  confirmLibraryChange: () => {},
  cancelLibraryChange: () => {},
});

// Custom hook to use the proposal context
export const useProposalContext = () => useContext(ProposalContext);

// Provider component
interface ProposalProviderProps {
  children: ReactNode;
}

export const ProposalProvider: React.FC<ProposalProviderProps> = ({
  children,
}) => {
  const [selectedComponents, setSelectedComponents] = useState<
    ProposalComponent[]
  >([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [publishModalVisible, setPublishModalVisible] =
    useState<boolean>(false);
  const [switchLibraryModalVisible, setSwitchLibraryModalVisible] =
    useState<boolean>(false);
  const [pendingLibraryChange, setPendingLibraryChange] = useState<
    string | null
  >(null);

  const { availableComponents, setSelectedLibrary } = useLibraryContext();

  // Initialize a component from a template
  const initializeComponent = (componentTemplate: any): ProposalComponent => {
    return {
      componentId: componentTemplate.id,
      instanceId: uuidv4(),
      baseId: componentTemplate.id,
      name: componentTemplate.name,
      description: componentTemplate.description,
      basePrice: componentTemplate.basePrice,
      subElements: componentTemplate.subElements.map((subElement: any) => ({
        ...subElement,
        value: subElement.default,
      })),
    };
  };

  // Add a component to the proposal
  const addComponent = (componentId: string) => {
    const componentTemplate = availableComponents.find(
      (c) => c.id === componentId
    );
    if (!componentTemplate) return;

    // Check if component allows multiple instances
    if (
      !componentTemplate.allowMultiple &&
      selectedComponents.some((c) => c.baseId === componentId)
    ) {
      alert(`You can only add one ${componentTemplate.name} component.`);
      return;
    }

    const newComponent = initializeComponent(componentTemplate);
    setSelectedComponents((prev) => [...prev, newComponent]);
  };

  // Remove a component from the proposal
  const removeComponent = (instanceId: string) => {
    setSelectedComponents((prev) =>
      prev.filter((c) => c.instanceId !== instanceId)
    );
  };

  // Update a sub-element value
  const updateSubElementValue = (
    instanceId: string,
    subElementId: string,
    newValue: any
  ) => {
    setSelectedComponents((prev) =>
      prev.map((component) => {
        if (component.instanceId === instanceId) {
          return {
            ...component,
            subElements: component.subElements.map((subElement) => {
              if (subElement.id === subElementId) {
                return {
                  ...subElement,
                  value: newValue,
                };
              }
              return subElement;
            }),
          };
        }
        return component;
      })
    );
  };

  // Increment a quantity sub-element
  const incrementSubElement = (instanceId: string, subElementId: string) => {
    setSelectedComponents((prev) =>
      prev.map((component) => {
        if (component.instanceId === instanceId) {
          return {
            ...component,
            subElements: component.subElements.map((subElement) => {
              if (
                subElement.id === subElementId &&
                subElement.type === "quantity"
              ) {
                const currentValue = subElement.value || 0;
                const max = subElement.max;
                const newValue =
                  max !== undefined
                    ? Math.min(currentValue + 1, max)
                    : currentValue + 1;
                return {
                  ...subElement,
                  value: newValue,
                };
              }
              return subElement;
            }),
          };
        }
        return component;
      })
    );
  };

  // Decrement a quantity sub-element
  const decrementSubElement = (instanceId: string, subElementId: string) => {
    setSelectedComponents((prev) =>
      prev.map((component) => {
        if (component.instanceId === instanceId) {
          return {
            ...component,
            subElements: component.subElements.map((subElement) => {
              if (
                subElement.id === subElementId &&
                subElement.type === "quantity"
              ) {
                const currentValue = subElement.value || 0;
                const min = subElement.min !== undefined ? subElement.min : 0;
                const newValue = Math.max(currentValue - 1, min);
                return {
                  ...subElement,
                  value: newValue,
                };
              }
              return subElement;
            }),
          };
        }
        return component;
      })
    );
  };

  // Confirm library change
  const confirmLibraryChange = () => {
    console.log(
      "ProposalContext: Confirming library change to",
      pendingLibraryChange
    );
    if (pendingLibraryChange) {
      setSelectedComponents([]);
      setSelectedLibrary(pendingLibraryChange);
      setPendingLibraryChange(null);
      setSwitchLibraryModalVisible(false);
    }
  };

  // Cancel library change
  const cancelLibraryChange = () => {
    console.log("ProposalContext: Canceling library change");
    setPendingLibraryChange(null);
    setSwitchLibraryModalVisible(false);
  };

  const value = {
    selectedComponents,
    setSelectedComponents,
    addComponent,
    removeComponent,
    updateSubElementValue,
    incrementSubElement,
    decrementSubElement,
    modalVisible,
    setModalVisible,
    publishModalVisible,
    setPublishModalVisible,
    switchLibraryModalVisible,
    setSwitchLibraryModalVisible,
    pendingLibraryChange,
    setPendingLibraryChange,
    confirmLibraryChange,
    cancelLibraryChange,
  };

  return (
    <ProposalContext.Provider value={value}>
      {children}
    </ProposalContext.Provider>
  );
};

export default ProposalContext;
