// Component JSON Schema Validation

/**
 * JSON Schema for component validation
 */
export interface SubElement {
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

export interface ComponentSchema {
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

/**
 * Validates a component against the JSON schema
 * 
 * @param component The component to validate
 * @returns Object containing validation result and any errors
 */
export const validateComponent = (component: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Validate required fields
  if (!component.id) errors.push("Component ID is required");
  if (!component.name) errors.push("Component name is required");
  if (!component.description) errors.push("Component description is required");
  
  // Validate basePrice
  if (component.basePrice === undefined || component.basePrice === null) {
    errors.push("Base price is required");
  } else if (typeof component.basePrice !== "number") {
    errors.push("Base price must be a number");
  } else if (component.basePrice < 0) {
    errors.push("Base price cannot be negative");
  }

  // Validate subElements
  if (!Array.isArray(component.subElements)) {
    errors.push("Sub-elements must be an array");
  } else {
    component.subElements.forEach((element: any, index: number) => {
      if (!element.id) errors.push(`Sub-element #${index + 1}: ID is required`);
      if (!element.name) errors.push(`Sub-element #${index + 1}: Name is required`);
      if (!element.type) {
        errors.push(`Sub-element #${index + 1}: Type is required`);
      } else if (!["quantity", "boolean", "selection"].includes(element.type)) {
        errors.push(`Sub-element #${index + 1}: Type must be 'quantity', 'boolean', or 'selection'`);
      }

      if (element.priceImpact === undefined || element.priceImpact === null) {
        errors.push(`Sub-element #${index + 1}: Price impact is required`);
      } else if (typeof element.priceImpact !== "number") {
        errors.push(`Sub-element #${index + 1}: Price impact must be a number`);
      }

      // Validate options for selection type
      if (element.type === "selection" && (!element.options || !Array.isArray(element.options) || element.options.length === 0)) {
        errors.push(`Sub-element #${index + 1}: Selection type requires at least one option`);
      }
    });
  }

  // Validate metadata if present
  if (component.metadata) {
    // Validate inputs if present
    if (component.metadata.inputs && !Array.isArray(component.metadata.inputs)) {
      errors.push("Metadata inputs must be an array");
    }
    
    // Validate tools if present
    if (component.metadata.tools && !Array.isArray(component.metadata.tools)) {
      errors.push("Metadata tools must be an array");
    }
    
    // Validate outputs if present
    if (component.metadata.outputs && !Array.isArray(component.metadata.outputs)) {
      errors.push("Metadata outputs must be an array");
    }
    
    // Validate examples if present
    if (component.metadata.examples && !Array.isArray(component.metadata.examples)) {
      errors.push("Metadata examples must be an array");
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Returns a new empty component template with default values
 */
export const createEmptyComponent = (libraryId: string): ComponentSchema => {
  return {
    id: `${libraryId}-${Date.now()}`,
    name: "New Component",
    description: "Component description",
    basePrice: 0,
    allowMultiple: false,
    subElements: [],
  };
};

/**
 * Returns a new empty sub-element template of the specified type
 */
export const createEmptySubElement = (type: "quantity" | "boolean" | "selection"): SubElement => {
  const base: SubElement = {
    id: `subelem-${Date.now()}`,
    name: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
    type,
    priceImpact: 0
  };

  // Add type-specific properties
  switch(type) {
    case "quantity":
      return {
        ...base,
        default: 1,
        min: 1,
        max: 10,
        hasVolumeDiscount: false
      };
    case "boolean":
      return {
        ...base,
        default: false
      };
    case "selection":
      return {
        ...base,
        options: [
          { value: "option1", label: "Option 1" },
          { value: "option2", label: "Option 2" }
        ],
        default: "option1"
      };
    default:
      return base;
  }
}; 