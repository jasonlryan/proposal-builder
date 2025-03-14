# Implementation Guide
## Proposal Builder System for Cursor

This guide provides detailed instructions for implementing the Proposal Builder system using Cursor IDE, focusing on React development with modern best practices.

## 1. Environment Setup

### 1.1 Prerequisites
- Node.js (v16+)
- npm (v8+) or yarn (v1.22+)
- Cursor IDE
- Git

### 1.2 Initial Setup

```bash
# Clone the repository
git clone https://github.com/your-organization/proposal-builder.git

# Navigate to project directory
cd proposal-builder

# Install dependencies
npm install
```

### 1.3 Cursor-Specific Configuration

Open the project in Cursor IDE and configure the following:

1. Open Cursor settings (Cmd+, or Ctrl+,)
2. Navigate to "Language Features"
3. Enable "TypeScript Support"
4. Enable "React Syntax Highlighting"
5. Enable "AI-Assisted Code Completion"

Create a `.cursor.json` file in the project root:

```json
{
  "project": "proposal-builder",
  "suggestions": {
    "enabled": true,
    "mode": "inline"
  },
  "formatOnSave": true,
  "linting": {
    "enabled": true,
    "eslint": true
  }
}
```

## 2. Project Structure

```
proposal-builder/
├── public/
│   ├── index.html
│   └── assets/
│       └── component-libraries.json
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── Footer.jsx
│   │   ├── library/
│   │   │   ├── LibrarySelector.jsx
│   │   │   ├── ComponentLibrary.jsx
│   │   │   └── ComponentCard.jsx
│   │   ├── proposal/
│   │   │   ├── ProposalFrame.jsx
│   │   │   ├── ProposalComponent.jsx
│   │   │   └── SubElementConfig.jsx
│   │   ├── summary/
│   │   │   ├── ProposalSummary.jsx
│   │   │   └── PricingDetail.jsx
│   │   └── modals/
│   │       ├── PreviewModal.jsx
│   │       ├── PublishModal.jsx
│   │       └── ConfirmationModal.jsx
│   ├── hooks/
│   │   ├── useComponentLibrary.js
│   │   ├── useDragAndDrop.js
│   │   ├── usePricing.js
│   │   └── useProposal.js
│   ├── context/
│   │   ├── LibraryContext.js
│   │   └── ProposalContext.js
│   ├── services/
│   │   ├── api.js
│   │   ├── pricing.js
│   │   └── export.js
│   ├── utils/
│   │   ├── formatters.js
│   │   ├── validators.js
│   │   └── calculations.js
│   ├── App.jsx
│   └── index.js
├── package.json
├── .eslintrc.js
├── .prettierrc
└── README.md
```

## 3. Key Implementations

### 3.1 Component Libraries Data Structure

Store your component libraries in `public/assets/component-libraries.json`:

```javascript
// In Cursor, use the provided file in the PRD to build this structure
// Cursor Tip: Use Cmd+Shift+P -> "Insert File Content" to import the JSON structure
```

### 3.2 Main Application Component

```jsx
// src/App.jsx
import React, { useState } from 'react';
import { LibraryContext } from './context/LibraryContext';
import { ProposalContext } from './context/ProposalContext';
import Header from './components/layout/Header';
import LibrarySelector from './components/library/LibrarySelector';
import ComponentLibrary from './components/library/ComponentLibrary';
import ProposalFrame from './components/proposal/ProposalFrame';
import ProposalSummary from './components/summary/ProposalSummary';
import PreviewModal from './components/modals/PreviewModal';
import PublishModal from './components/modals/PublishModal';
import ConfirmationModal from './components/modals/ConfirmationModal';

function App() {
  // State for selected library
  const [selectedLibrary, setSelectedLibrary] = useState('ai-b-c');
  const [availableComponents, setAvailableComponents] = useState([]);
  
  // State for proposal
  const [selectedComponents, setSelectedComponents] = useState([]);
  
  // Modal states
  const [modalVisible, setModalVisible] = useState(false);
  const [publishModalVisible, setPublishModalVisible] = useState(false);
  const [switchLibraryModalVisible, setSwitchLibraryModalVisible] = useState(false);
  const [pendingLibraryChange, setPendingLibraryChange] = useState(null);
  
  // Load component libraries from JSON
  React.useEffect(() => {
    fetch('/assets/component-libraries.json')
      .then(response => response.json())
      .then(data => {
        setAvailableComponents(data.componentLibraries[selectedLibrary].components);
      })
      .catch(error => console.error('Error loading component libraries:', error));
  }, [selectedLibrary]);
  
  // Handle library change with confirmation if needed
  const handleLibraryChange = (newLibrary) => {
    if (selectedComponents.length > 0) {
      setPendingLibraryChange(newLibrary);
      setSwitchLibraryModalVisible(true);
    } else {
      setSelectedLibrary(newLibrary);
    }
  };
  
  // Library context value
  const libraryContextValue = {
    selectedLibrary,
    setSelectedLibrary,
    availableComponents,
    handleLibraryChange
  };
  
  // Proposal context value
  const proposalContextValue = {
    selectedComponents,
    setSelectedComponents,
    modalVisible,
    setModalVisible,
    publishModalVisible,
    setPublishModalVisible
  };
  
  return (
    <LibraryContext.Provider value={libraryContextValue}>
      <ProposalContext.Provider value={proposalContextValue}>
        <div className="proposal-builder">
          <Header />
          
          <div className="container mx-auto px-4">
            <LibrarySelector 
              selectedLibrary={selectedLibrary} 
              onChange={handleLibraryChange} 
            />
            
            <div className="builder-layout flex gap-6">
              <ComponentLibrary />
              <ProposalFrame />
              <ProposalSummary />
            </div>
          </div>
          
          {modalVisible && <PreviewModal />}
          {publishModalVisible && <PublishModal />}
          {switchLibraryModalVisible && (
            <ConfirmationModal 
              title="Change Component Library?"
              message={`Changing libraries will remove all current components. Continue?`}
              onConfirm={() => {
                setSelectedComponents([]);
                setSelectedLibrary(pendingLibraryChange);
                setSwitchLibraryModalVisible(false);
              }}
              onCancel={() => setSwitchLibraryModalVisible(false)}
            />
          )}
        </div>
      </ProposalContext.Provider>
    </LibraryContext.Provider>
  );
}

export default App;
```

### 3.3 Custom Hooks Implementation

#### Drag and Drop Hook

```jsx
// src/hooks/useDragAndDrop.js
import { useRef } from 'react';
import { useProposalContext } from './useProposal';

export function useDragAndDrop() {
  const dragItem = useRef(null);
  const proposalRef = useRef(null);
  const { addComponent } = useProposalContext();
  
  const handleDragStart = (e, componentId) => {
    dragItem.current = componentId;
    e.dataTransfer.setData('text/plain', componentId);
    e.dataTransfer.effectAllowed = 'copy';
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    if (proposalRef.current) {
      proposalRef.current.classList.add('drag-over');
    }
  };
  
  const handleDragLeave = () => {
    if (proposalRef.current) {
      proposalRef.current.classList.remove('drag-over');
    }
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    if (proposalRef.current) {
      proposalRef.current.classList.remove('drag-over');
    }
    
    const componentId = dragItem.current;
    if (componentId) {
      addComponent(componentId);
    }
  };
  
  return {
    dragItem,
    proposalRef,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop
  };
}
```

#### Pricing Hook

```jsx
// src/hooks/usePricing.js
import { useProposalContext } from './useProposal';

export function usePricing() {
  const { selectedComponents } = useProposalContext();
  
  // Calculate component price
  const calculateComponentPrice = (component) => {
    let price = component.basePrice;
    
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
        // For selections with multipliers
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
  const formatCurrency = (amount) => {
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
```

### 3.4 Component Implementation

#### Component Library

```jsx
// src/components/library/ComponentLibrary.jsx
import React from 'react';
import { useLibraryContext } from '../../hooks/useComponentLibrary';
import ComponentCard from './ComponentCard';

function ComponentLibrary() {
  const { selectedLibrary, availableComponents } = useLibraryContext();
  
  return (
    <div className="component-library w-1/4 bg-white rounded-lg shadow-md p-4">
      <h2 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">
        {selectedLibrary} Components
      </h2>
      
      <div className="library-components space-y-4">
        {availableComponents.map(component => (
          <ComponentCard 
            key={component.id}
            component={component}
          />
        ))}
      </div>
    </div>
  );
}

export default ComponentLibrary;
```

#### ComponentCard

```jsx
// src/components/library/ComponentCard.jsx
import React from 'react';
import { useDragAndDrop } from '../../hooks/useDragAndDrop';

function ComponentCard({ component }) {
  const { handleDragStart } = useDragAndDrop();
  
  return (
    <div 
      className="library-component bg-white border border-gray-200 rounded p-4 cursor-move hover:border-blue-500 transition-colors"
      draggable="true"
      onDragStart={(e) => handleDragStart(e, component.id)}
    >
      <h3 className="font-semibold text-gray-800 mb-2">{component.name}</h3>
      <p className="text-sm text-gray-600 mb-3">{component.description}</p>
      <div className="flex justify-between items-center">
        <span className="text-blue-600 font-medium">£{component.basePrice.toLocaleString()}</span>
        {component.allowMultiple && (
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
            Multiple allowed
          </span>
        )}
      </div>
    </div>
  );
}

export default ComponentCard;
```

#### ProposalFrame

```jsx
// src/components/proposal/ProposalFrame.jsx
import React from 'react';
import { useDragAndDrop } from '../../hooks/useDragAndDrop';
import { useProposalContext } from '../../hooks/useProposal';
import ProposalComponent from './ProposalComponent';

function ProposalFrame() {
  const { proposalRef, handleDragOver, handleDragLeave, handleDrop } = useDragAndDrop();
  const { selectedComponents } = useProposalContext();
  
  return (
    <div 
      ref={proposalRef}
      className="proposal-frame w-1/2 border-2 border-dashed border-gray-300 rounded-lg p-6 bg-white min-h-screen"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <h2 className="text-lg font-semibold mb-4 text-gray-800 text-center">Your Proposal</h2>
      
      {selectedComponents.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-gray-500 mb-2">Drag components here to build your proposal</p>
          <p className="text-sm text-gray-400">Components will appear here after you drag them from the library</p>
        </div>
      )}
      
      <div className="selected-components space-y-6">
        {selectedComponents.map(component => (
          <ProposalComponent 
            key={component.instanceId}
            component={component}
          />
        ))}
      </div>
    </div>
  );
}

export default ProposalFrame;
```

### 3.5 Pricing Logic Implementation

```javascript
// src/services/pricing.js
export function calculateVolumeDiscount(hours) {
  if (hours >= 10) {
    return 0.9; // 10% discount
  } else if (hours >= 5) {
    return 0.95; // 5% discount
  }
  return 1; // No discount
}

export function calculateComponentPrice(component) {
  if (!component) return 0;
  
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
}

export function calculateSubtotal(components) {
  return components
    .filter(c => c.baseId !== "contingency" && c.baseId !== "genericInfo")
    .reduce((sum, comp) => sum + calculateComponentPrice(comp), 0);
}

export function calculateContingency(components) {
  const contingency = components.find(c => c.baseId === "contingency");
  if (!contingency) return 0;
  
  const rateElement = contingency.subElements.find(s => s.id === "contingencyRate");
  return calculateSubtotal(components) * (rateElement?.value || 0);
}

export function calculateTotal(components) {
  return calculateSubtotal(components) + calculateContingency(components);
}

export function formatCurrency(amount) {
  return `£${amount.toLocaleString('en-UK')}`;
}
```

## 4. Development Workflow in Cursor

### 4.1 Using Cursor's AI Features

Cursor IDE offers several AI-powered features that can speed up development:

1. **Code Completion**: As you type, Cursor will suggest completions based on context.
2. **Inline Documentation**: Cursor can generate documentation for functions and components.
3. **Refactoring Suggestions**: Cursor can suggest refactoring opportunities.
4. **Error Explanation**: When you encounter errors, Cursor can explain them and suggest fixes.

To get the most out of these features:

```
// Example of using Cursor's AI assistant
// 1. Select a block of code
// 2. Press Cmd+K (Mac) or Ctrl+K (Windows)
// 3. Type a command like "refactor this to use hooks" or "optimize this function"
```

### 4.2 Component Development Workflow

1. **Start with Data Models**: Define your data structures first
2. **Create Context Providers**: Set up the state management
3. **Build Reusable Hooks**: Encapsulate logic in custom hooks
4. **Develop Components**: Build from bottom up (small components first)
5. **Connect Everything**: Integrate all components in parent containers

### 4.3 Testing Approach

```bash
# Install testing dependencies
npm install --save-dev jest @testing-library/react @testing-library/jest-dom

# Run tests
npm test
```

Create a test file for each component:

```jsx
// src/components/library/ComponentCard.test.jsx
import { render, screen } from '@testing-library/react';
import ComponentCard from './ComponentCard';

describe('ComponentCard', () => {
  const mockComponent = {
    id: 'test-component',
    name: 'Test Component',
    description: 'This is a test component',
    basePrice: 1000,
    allowMultiple: true
  };
  
  it('renders component information correctly', () => {
    render(<ComponentCard component={mockComponent} />);
    
    expect(screen.getByText('Test Component')).toBeInTheDocument();
    expect(screen.getByText('This is a test component')).toBeInTheDocument();
    expect(screen.getByText('£1,000')).toBeInTheDocument();
    expect(screen.getByText('Multiple allowed')).toBeInTheDocument();
  });
});
```

## 5. Production Deployment

### 5.1 Build Process

```bash
# Create optimized production build
npm run build

# Preview the production build locally
npx serve -s build
```

### 5.2 Deployment Options

1. **Static Hosting**:
   - Netlify
   - Vercel
   - AWS S3 + CloudFront
   - GitHub Pages

2. **Server-Based Hosting**:
   - AWS Elastic Beanstalk
   - Heroku
   - DigitalOcean App Platform
   - Google Cloud Run

### 5.3 Deployment Script for Netlify

Create a `netlify.toml` file in the project root:

```toml
[build]
  command = "npm run build"
  publish = "build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## 6. Performance Optimization

### 6.1 Code Splitting

```jsx
import React, { lazy, Suspense } from 'react';

// Lazy load components
const PreviewModal = lazy(() => import('./components/modals/PreviewModal'));
const PublishModal = lazy(() => import('./components/modals/PublishModal'));

function App() {
  // ... other code
  
  return (
    <div>
      {/* ... other components */}
      
      <Suspense fallback={<div>Loading...</div>}>
        {modalVisible && <PreviewModal />}
        {publishModalVisible && <PublishModal />}
      </Suspense>
    </div>
  );
}
```

### 6.2 Memoization

```jsx
import React, { useMemo } from 'react';

function ProposalSummary() {
  const { selectedComponents } = useProposalContext();
  const { calculateSubtotal, calculateContingency, calculateTotal } = usePricing();
  
  // Memoize calculations to prevent unnecessary recalculations
  const subtotal = useMemo(() => calculateSubtotal(), [selectedComponents]);
  const contingency = useMemo(() => calculateContingency(), [selectedComponents, subtotal]);
  const total = useMemo(() => calculateTotal(), [subtotal, contingency]);
  
  // ...render component
}
```

### 6.3 Image Optimization

Optimize all images in the `public/assets` directory:

```bash
# Install image optimization tools
npm install -g imagemin-cli

# Optimize PNG images
imagemin public/assets/*.png --out-dir=public/assets/optimized

# Use optimized images in your code
<img src="/assets/optimized/logo.png" alt="Logo" />
```

## 7. Troubleshooting Common Issues

### 7.1 Component Not Appearing in Proposal

**Symptoms:**
- Component drags but doesn't appear in proposal frame

**Solutions:**
- Check component ID matches in both drag start and drop handlers
- Verify component data is being properly loaded and initialized
- Check React key prop is unique for each component

### 7.2 Pricing Calculation Errors

**Symptoms:**
- Incorrect pricing displayed
- NaN or undefined showing in price fields

**Solutions:**
- Add null checks for all price calculations
- Use default values (|| 0) for all numerical operations
- Check that sub-element types match their expected data types
- Add console.log statements to debug price calculation flow

### 7.3 Performance Issues

**Symptoms:**
- Slow response when adding/configuring components
- UI lag when changing values

**Solutions:**
- Implement useMemo and useCallback for expensive calculations
- Add React.memo to prevent unnecessary re-renders
- Check for excessive re-renders using React DevTools
- Implement virtualization for long lists of components

## 8. Extension Points

### 8.1 Adding a New Component Type

To add a new component type to a library:

1. Update the component-libraries.json file:

```json
{
  "id": "newComponent",
  "name": "New Component",
  "description": "Description of the new component",
  "basePrice": 1000,
  "subElements": [
    {
      "id": "subElement1",
      "name": "Sub Element 1",
      "type": "quantity",
      "priceImpact": 200,
      "default": 0,
      "min": 0
    }
  ]
}
```

2. Add any special pricing logic if needed:

```javascript
// In src/services/pricing.js
if (component.baseId === "newComponent") {
  // Special pricing logic for the new component
}
```

### 8.2 Creating a New Component Library

To add a new component library:

1. Add the library definition to component-libraries.json:

```json
"new-library": {
  "name": "New Library",
  "description": "Description of the new library",
  "components": []
}
```

2. Add components to the new library following the existing structure.

3. Update the library selector to include the new library:

```jsx
// In src/components/library/LibrarySelector.jsx
const libraries = [
  { id: "ai-b-c", name: "AI-B-C Programme" },
  { id: "research-sprint", name: "Research Sprint" },
  { id: "new-library", name: "New Library" }
];
```

## 9. Further Resources

### 9.1 Cursor-Specific Resources
- [Cursor Documentation](https://cursor.sh/docs)
- [Cursor Keyboard Shortcuts](https://cursor.sh/docs/keyboard-shortcuts)
- [Cursor AI Commands](https://cursor.sh/docs/ai-commands)

### 9.2 React Resources
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [React Hooks API Reference](https://reactjs.org/docs/hooks-reference.html)
- [React DnD Documentation](https://react-dnd.github.io/react-dnd/docs/overview)

### 9.3 UI Framework Resources
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Component Libraries](https://www.npmjs.com/package/react-component-library)

---

Document Version: 1.0  
Last Updated: March 14, 2025  
Author: Development Team
