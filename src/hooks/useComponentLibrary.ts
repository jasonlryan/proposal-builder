import { useLibraryContext } from '../context/LibraryContext';
import { useProposalContext } from '../context/ProposalContext';

export function useComponentLibrary() {
  const { 
    selectedLibrary, 
    availableComponents, 
    libraries, 
    isLoading, 
    error,
    setSelectedLibrary
  } = useLibraryContext();
  
  const { 
    pendingLibraryChange, 
    setPendingLibraryChange, 
    switchLibraryModalVisible, 
    setSwitchLibraryModalVisible,
    selectedComponents
  } = useProposalContext();
  
  // Get library options for dropdown
  const getLibraryOptions = () => {
    return Object.keys(libraries).map(key => ({
      id: key,
      name: libraries[key].name
    }));
  };
  
  // Handle library change with confirmation if needed
  const handleLibraryChange = (newLibrary: string) => {
    if (selectedComponents.length > 0) {
      setPendingLibraryChange(newLibrary);
      setSwitchLibraryModalVisible(true);
    } else {
      // If no components are selected, change library directly
      setSelectedLibrary(newLibrary);
    }
  };
  
  // Get current library description
  const getCurrentLibraryDescription = () => {
    return libraries[selectedLibrary]?.description || '';
  };
  
  return {
    selectedLibrary,
    availableComponents,
    libraries,
    isLoading,
    error,
    getLibraryOptions,
    handleLibraryChange,
    getCurrentLibraryDescription,
    pendingLibraryChange,
    switchLibraryModalVisible
  };
} 