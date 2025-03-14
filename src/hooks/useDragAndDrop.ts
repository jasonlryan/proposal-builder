import { useRef, useState } from 'react';
import { useProposalContext } from '../context/ProposalContext';

export function useDragAndDrop() {
  const dragItem = useRef<string | null>(null);
  const proposalRef = useRef<HTMLDivElement | null>(null);
  const { addComponent } = useProposalContext();
  const [isDragging, setIsDragging] = useState(false);
  
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, componentId: string) => {
    console.log('Drag started with component ID:', componentId);
    dragItem.current = componentId;
    e.dataTransfer.setData('text/plain', componentId);
    e.dataTransfer.effectAllowed = 'copy';
    setIsDragging(true);
    
    // For Firefox compatibility
    if (e.dataTransfer.setDragImage) {
      const elem = e.currentTarget;
      e.dataTransfer.setDragImage(elem, 20, 20);
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
    
    if (proposalRef.current) {
      proposalRef.current.classList.add('drag-over');
    }
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (proposalRef.current) {
      proposalRef.current.classList.remove('drag-over');
    }
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    console.log('Drop event triggered');
    e.preventDefault();
    e.stopPropagation();
    
    if (proposalRef.current) {
      proposalRef.current.classList.remove('drag-over');
    }
    
    const componentId = e.dataTransfer.getData('text/plain') || dragItem.current;
    console.log('Component ID from drop:', componentId);
    
    if (componentId) {
      addComponent(componentId);
      console.log('Component added:', componentId);
    } else {
      console.warn('No component ID found during drop');
    }
    
    setIsDragging(false);
    dragItem.current = null;
  };
  
  const handleDragEnd = () => {
    setIsDragging(false);
    dragItem.current = null;
    
    if (proposalRef.current) {
      proposalRef.current.classList.remove('drag-over');
    }
  };
  
  return {
    dragItem,
    proposalRef,
    isDragging,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDragEnd
  };
} 