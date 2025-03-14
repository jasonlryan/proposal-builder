import { useProposalContext } from '../context/ProposalContext';

// Re-export the useProposalContext hook
export { useProposalContext };

// Additional proposal-related hooks can be added here
export function useProposal() {
  const context = useProposalContext();
  
  // Add any additional proposal-related functionality here
  
  return context;
} 