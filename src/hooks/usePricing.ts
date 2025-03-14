import { useProposalContext, ProposalComponent } from '../context/ProposalContext';

export function usePricing() {
  const { selectedComponents } = useProposalContext();
  
  // Calculate component price
  const calculateComponentPrice = (component: ProposalComponent) => {
    let price = component.basePrice;
    
    // Special handling for Power Hour which has base price included in hours
    if (component.baseId === "powerHour") {
      price = 0; // Reset base price to zero as it's included in the hourly rate
    }
    
    component.subElements.forEach(sub => {
      if (sub.type === "quantity") {
        let itemPrice = sub.priceImpact * (sub.value || 0);
        
        // Apply volume discount for Power Hour
        if (sub.hasVolumeDiscount && component.baseId === "powerHour" && sub.id === "hours") {
          const hours = sub.value || 0;
          if (hours >= 10) {
            // 10% discount for 10+ hours
            itemPrice = itemPrice * 0.9;
          } else if (hours >= 5) {
            // 5% discount for 5-9 hours
            itemPrice = itemPrice * 0.95;
          }
        }
        
        price += itemPrice;
      } else if (sub.type === "boolean" && sub.value) {
        price += sub.priceImpact;
      } else if (sub.type === "selection" && sub.value && sub.priceImpact) {
        // For selections with multipliers (like data volume)
        if (typeof sub.value === 'number' && sub.value > 0) {
          price += sub.priceImpact * sub.value;
        } else {
          price += sub.priceImpact;
        }
      }
    });
    
    return price;
  };
  
  // Calculate subtotal (excluding contingency)
  const calculateSubtotal = () => {
    return selectedComponents
      .filter(c => c.baseId !== "contingency" && c.baseId !== "genericInfo")
      .reduce((sum, comp) => sum + calculateComponentPrice(comp), 0);
  };
  
  // Calculate contingency
  const calculateContingency = () => {
    const contingency = selectedComponents.find(c => c.baseId === "contingency");
    if (!contingency) return 0;
    
    const rateElement = contingency.subElements.find(s => s.id === "contingencyRate");
    return calculateSubtotal() * (rateElement?.value || 0);
  };
  
  // Calculate total
  const calculateTotal = () => calculateSubtotal() + calculateContingency();
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return `£${amount.toLocaleString('en-UK')}`;
  };
  
  // Get contingency rate as string
  const getContingencyRate = () => {
    const contingency = selectedComponents.find(c => c.baseId === "contingency");
    if (!contingency) return "0%";
    
    const rateElement = contingency.subElements.find(s => s.id === "contingencyRate");
    return rateElement?.value ? `${rateElement.value * 100}%` : "0%";
  };
  
  return {
    calculateComponentPrice,
    calculateSubtotal,
    calculateContingency,
    calculateTotal,
    formatCurrency,
    getContingencyRate
  };
} 