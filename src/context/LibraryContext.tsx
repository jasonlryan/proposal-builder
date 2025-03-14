import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// Define types for our context
interface Component {
  id: string;
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
  default: any;
  min?: number;
  max?: number;
  hasVolumeDiscount?: boolean;
  options?: { value: any; label: string }[];
}

interface ComponentLibrary {
  name: string;
  description: string;
  components: Component[];
}

interface ComponentLibraries {
  [key: string]: ComponentLibrary;
}

interface LibraryContextType {
  selectedLibrary: string;
  setSelectedLibrary: React.Dispatch<React.SetStateAction<string>>;
  availableComponents: Component[];
  handleLibraryChange: (newLibrary: string) => void;
  libraries: ComponentLibraries;
  isLoading: boolean;
  error: string | null;
}

// Create the context with default values
const LibraryContext = createContext<LibraryContextType>({
  selectedLibrary: "ai-b-c",
  setSelectedLibrary: () => {},
  availableComponents: [],
  handleLibraryChange: () => {},
  libraries: {},
  isLoading: true,
  error: null,
});

// Custom hook to use the library context
export const useLibraryContext = () => useContext(LibraryContext);

// Provider component
interface LibraryProviderProps {
  children: ReactNode;
}

export const LibraryProvider: React.FC<LibraryProviderProps> = ({
  children,
}) => {
  const [selectedLibrary, setSelectedLibrary] = useState<string>("ai-b-c");
  const [libraries, setLibraries] = useState<ComponentLibraries>({});
  const [availableComponents, setAvailableComponents] = useState<Component[]>(
    []
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load component libraries from JSON
  useEffect(() => {
    const fetchLibraries = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/assets/component-libraries.json");
        if (!response.ok) {
          throw new Error(`Failed to fetch libraries: ${response.status}`);
        }
        const data = await response.json();
        setLibraries(data.componentLibraries);

        // Set available components based on selected library
        if (data.componentLibraries[selectedLibrary]) {
          setAvailableComponents(
            data.componentLibraries[selectedLibrary].components
          );
        }

        setIsLoading(false);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        setIsLoading(false);
      }
    };

    fetchLibraries();
  }, [selectedLibrary]);

  // Handle library change
  const handleLibraryChange = (newLibrary: string) => {
    setSelectedLibrary(newLibrary);
  };

  const value = {
    selectedLibrary,
    setSelectedLibrary,
    availableComponents,
    handleLibraryChange,
    libraries,
    isLoading,
    error,
  };

  return (
    <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>
  );
};

export default LibraryContext;
