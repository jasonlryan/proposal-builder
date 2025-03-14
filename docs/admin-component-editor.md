# Admin Component Editor Documentation

## Overview

The Admin Component Editor is a specialized interface for administrators to manage component libraries used in the Proposal Builder system. This editor allows administrators to create, edit, and manage components that consultants can later use to build proposals.

## Key Features

1. **Library Management**

   - Switch between multiple component libraries (AI-B-C Programme, Research Sprint, etc.)
   - View all available components within each library
   - Create new components with pre-populated default values

2. **Component Editing**

   - Edit basic component information (name, description, base price, etc.)
   - Toggle whether a component can be used multiple times in a proposal
   - Manage sub-elements with different types (quantity, boolean, selection)
   - Add, edit, and remove sub-elements

3. **Dual View Mode**

   - Form-based view for visual editing
   - JSON view for direct code editing and complex structures
   - Real-time validation with error feedback

4. **Validation**

   - Enforces required fields and proper data structures
   - Displays validation errors in real-time
   - Prevents saving invalid components

5. **Interactive Preview**
   - Shows a preview of how the component will appear in the Proposal Builder
   - Updates in real-time as changes are made

## Implementation Details

### Architecture

The Component Editor follows a modular architecture:

- **Main Component Editor**: The container component that manages overall state
- **Component Selector**: Left sidebar showing available components grouped by library
- **Form Editor**: Dynamic form-based interface for editing components
- **JSON Editor**: Code-based editor for advanced edits
- **Sub-Element Editor**: Modal interface for editing component sub-elements
- **Preview Panel**: Visual representation of edited components

### Data Flow

1. Component libraries are loaded from JSON files stored in `/public/assets/components/`.
2. When a component is selected, its data is displayed in the editor.
3. Changes are validated in real-time against a defined schema.
4. When saved, changes update the component in memory.
5. In a production environment, these changes would be persisted to the JSON files.

### Technical Implementation

- **React Hooks**: Used for state management with `useState` and `useEffect`
- **JSON Schema**: Validates component structure using a defined schema
- **Conditional Rendering**: Different UI elements based on sub-element types
- **Modal System**: For editing sub-elements without leaving the main interface
- **Real-time Preview**: Shows changes as they are made
- **Error Handling**: Comprehensive validation with user feedback

## Usage Guide

### Accessing the Editor

The Component Editor is available at the `/admin` route. You can access it by clicking the "Edit Components" link in the main navigation.

### Creating a New Component

1. Select the appropriate library from the dropdown in the left sidebar
2. Click the "+ New" button
3. Fill in the basic information in the form
4. Add sub-elements as needed
5. Click "Save Changes"

### Editing Existing Components

1. Select the library containing the component
2. Click on the component in the list
3. Make changes in the form or JSON view
4. Click "Save Changes"

### Adding Sub-Elements

1. Open a component for editing
2. Click the "+ Add Element" button in the Sub Elements section
3. Fill in the details in the modal
4. Click "Save"

### Switching View Modes

- Click "Form View" for a user-friendly interface
- Click "JSON View" for direct access to the JSON structure

## Best Practices

1. **Consistent Naming**: Use clear, consistent names for components and sub-elements
2. **Descriptive Descriptions**: Include detailed descriptions to help users understand the purpose
3. **Logical Pricing**: Ensure base prices and price impacts make sense for the component
4. **Schema Compliance**: Validate components against the schema before saving
5. **Testing**: Always test new or modified components in the Proposal Builder

## Technical Considerations

### React Hooks Rules

All React hooks in the Component Editor follow the Rules of Hooks:

- Hooks are only called at the top level of functional components
- Hooks are not called inside conditions, loops, or nested functions
- Component state is initialized before any conditional returns

### Schema Validation

Components are validated against a defined schema that includes:

- Required fields (id, name, description, base price, etc.)
- Type validation for all fields
- Min/max validation for appropriate fields
- Structure validation for complex fields like sub-elements

### Performance Considerations

- Large JSON files are loaded asynchronously
- Form fields update state efficiently to minimize re-renders
- Validation is performed on change and before save operations
- Modal components are only rendered when needed

## Troubleshooting

### Common Issues

1. **Validation Errors**: Check the validation error messages for specific issues with the component structure
2. **JSON Parsing Errors**: Ensure the JSON is valid when editing in JSON view
3. **Missing Libraries**: Verify the JSON files exist in the correct location
4. **Sub-Element Issues**: Make sure sub-elements have all required fields for their type

### Solutions

1. Use the form view for simpler edits to avoid JSON syntax errors
2. Review the schema documentation for field requirements
3. Test components in the Proposal Builder after making significant changes
4. Use the preview panel to verify how components will appear

## Future Enhancements

1. **Component Versioning**: Track changes to components over time
2. **Drag and Drop Ordering**: Reorder sub-elements with drag and drop
3. **Admin Authentication**: Secure admin access with user authentication
4. **Bulk Operations**: Import/export multiple components at once
5. **Component Testing**: Test components with simulation options

## Technical Reference

### Component Schema

```typescript
interface ComponentSchema {
  id: string; // Unique identifier
  baseId?: string; // Base type identifier
  name: string; // Display name
  description: string; // Detailed description
  basePrice: number; // Starting price
  allowMultiple?: boolean; // Can be used multiple times
  subElements: SubElement[]; // Configurable elements
}

interface SubElement {
  id: string; // Unique identifier
  name: string; // Display name
  type: "quantity" | "boolean" | "selection"; // Element type
  priceImpact: number; // Price effect
  default?: any; // Default value
  min?: number; // Minimum value (for quantity)
  max?: number; // Maximum value (for quantity)
  hasVolumeDiscount?: boolean; // Apply volume pricing
  options?: { value: any; label: string }[]; // For selections
}
```

### File Structure

- `/src/components/admin/ComponentEditor.tsx` - Main editor component
- `/src/components/admin/AdminRoute.tsx` - Route wrapper
- `/src/components/styles/admin.css` - Editor styles
- `/src/utils/schema.ts` - Validation utilities
- `/public/assets/components/library-components.json` - Component data
