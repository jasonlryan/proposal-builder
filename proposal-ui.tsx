import React, { useState, useRef, useEffect } from 'react';

// Component libraries organized by category
const componentLibraries = {
  "ai-b-c": {
    name: "AI-B-C Programme",
    description: "AI capability and innovation programmes for leaders and teams",
    components: [
      {
        id: "powerHour",
        name: "Power Hour",
        description: "One-hour focused coaching sessions.",
        basePrice: 300,
        subElements: [
          {
            id: "hours",
            name: "Number of Hours",
            type: "quantity",
            priceImpact: 300,
            default: 1,
            min: 1,
            hasVolumeDiscount: true
          }
        ]
      },
      {
        id: "discovery",
        name: "Discovery & Design",
        description: "Initial research and planning phase.",
        basePrice: 5000,
        subElements: [
          {
            id: "interviews",
            name: "Stakeholder Interviews",
            type: "quantity",
            priceImpact: 400,
            default: 0,
            min: 0,
            max: 20
          },
          {
            id: "userResearch",
            name: "User Research Session",
            type: "quantity",
            priceImpact: 600,
            default: 0,
            min: 0
          },
          {
            id: "competitiveAnalysis",
            name: "Competitive Analysis",
            type: "boolean",
            priceImpact: 1200,
            default: false
          }
        ]
      },
      {
        id: "workshop",
        name: "Workshop",
        description: "Interactive team sessions.",
        basePrice: 3000,
        allowMultiple: true,
        subElements: [
          {
            id: "designThinking",
            name: "Design Thinking",
            type: "boolean",
            priceImpact: 500,
            default: false
          },
          {
            id: "handsonPractice",
            name: "Hands-On Practice",
            type: "boolean",
            priceImpact: 750,
            default: false
          },
          {
            id: "strategySession",
            name: "Strategy Session",
            type: "boolean",
            priceImpact: 850,
            default: false
          },
          {
            id: "additionalDays",
            name: "Additional Workshop Days",
            type: "quantity",
            priceImpact: 2000,
            default: 0,
            min: 0,
            max: 5
          }
        ]
      },
      {
        id: "implementation",
        name: "Implementation & Experimentation",
        description: "Putting ideas into practice.",
        basePrice: 6000,
        subElements: [
          {
            id: "weeklyCheckins",
            name: "Weekly Check-Ins",
            type: "quantity",
            priceImpact: 500,
            default: 0,
            min: 0
          },
          {
            id: "demoDay",
            name: "Demo Day",
            type: "boolean",
            priceImpact: 1000,
            default: false
          },
          {
            id: "usabilityTesting",
            name: "Usability Testing",
            type: "quantity",
            priceImpact: 800,
            default: 0,
            min: 0
          }
        ]
      },
      {
        id: "coaching",
        name: "Coaching",
        description: "Expert guidance for teams.",
        basePrice: 0,
        subElements: [
          {
            id: "coachingDays",
            name: "Coaching Days",
            type: "quantity",
            priceImpact: 1200,
            default: 0,
            min: 0
          }
        ]
      },
      {
        id: "tools",
        name: "Tools & Integration",
        description: "Technical solutions and automation.",
        basePrice: 2000,
        subElements: [
          {
            id: "integrationScripts",
            name: "Integration Scripts",
            type: "quantity",
            priceImpact: 500,
            default: 0,
            min: 0
          },
          {
            id: "apiDevelopment",
            name: "API Development",
            type: "boolean",
            priceImpact: 1500,
            default: false
          },
          {
            id: "dataMigration",
            name: "Data Migration",
            type: "boolean",
            priceImpact: 1200,
            default: false
          }
        ]
      },
      {
        id: "contingency",
        name: "Contingency",
        description: "Risk management buffer to account for unexpected challenges and scope refinements.",
        basePrice: 0,
        subElements: [
          {
            id: "contingencyRate",
            name: "Contingency Rate",
            type: "selection",
            options: [
              {value: 0, label: "None"},
              {value: 0.05, label: "5%"},
              {value: 0.10, label: "10%"},
              {value: 0.15, label: "15%"},
              {value: 0.20, label: "20%"}
            ],
            default: 0
          }
        ]
      },
      {
        id: "genericInfo",
        name: "Generic Informational Blocks",
        description: "Non-billable information resources to enhance proposal context and clarity.",
        basePrice: 0,
        allowMultiple: true,
        subElements: [
          {
            id: "infoBlocks",
            name: "Information Blocks",
            type: "quantity",
            priceImpact: 0,
            default: 0,
            min: 0
          }
        ]
      }
    ]
  },
  "research-sprint": {
    name: "Research Sprint",
    description: "Focused research activities to gather insights",
    components: [
      {
        id: "dataReview",
        name: "Reviewing Existing Data",
        description: "Analysis of existing research materials.",
        basePrice: 3500,
        subElements: [
          {
            id: "gatherDocumentation",
            name: "Gather All Existing Documentation",
            type: "boolean",
            priceImpact: 750,
            default: false
          },
          {
            id: "extractKeyPoints",
            name: "Extract Key Points",
            type: "boolean",
            priceImpact: 1200,
            default: false
          },
          {
            id: "organizeFindings",
            name: "Organize Findings",
            type: "boolean",
            priceImpact: 900,
            default: false
          },
          {
            id: "dataSize",
            name: "Volume of Data to Review",
            type: "selection",
            options: [
              {value: 1, label: "Small (1-5 documents)"},
              {value: 1.5, label: "Medium (6-15 documents)"},
              {value: 2, label: "Large (16+ documents)"}
            ],
            default: 1,
            priceImpact: 800
          }
        ],
        metadata: {
          inputs: [
            "Old marketing research",
            "Persona documents",
            "Previous campaign data",
            "Stakeholder interviews"
          ],
          tools: [
            "Document Repositories (Google Drive, Notion)",
            "Summarization AI (ChatGPT, Claude)",
            "Collaboration (Airtable, Google Sheets/Docs)"
          ],
          outputs: [
            "Existing Data Summary",
            "Gap List"
          ],
          examples: [
            "Brand Refresh: Reevaluating old audience research",
            "New Product Launch: Incorporate lessons from past pilots",
            "Competitive Update: Check if market shifts invalidate old data",
            "BMW F900 R/XR project: Summarize survey/persona findings for targeted campaigns"
          ]
        }
      },
      {
        id: "fieldResearch",
        name: "Field Research",
        description: "Direct user observation and interviews.",
        basePrice: 5000,
        subElements: [
          {
            id: "interviews",
            name: "User Interviews",
            type: "quantity",
            priceImpact: 750,
            default: 0,
            min: 0,
            max: 15
          },
          {
            id: "contextualInquiry",
            name: "Contextual Inquiry",
            type: "boolean",
            priceImpact: 2000,
            default: false
          },
          {
            id: "ethnography",
            name: "Ethnographic Observation",
            type: "boolean",
            priceImpact: 2500,
            default: false
          }
        ],
        metadata: {
          inputs: [
            "Research questions",
            "User recruitment criteria",
            "Interview guides",
            "Recording equipment"
          ],
          tools: [
            "Interview recording software",
            "Note-taking tools",
            "Transcription services",
            "Observation frameworks"
          ],
          outputs: [
            "Interview transcripts",
            "Field notes",
            "Key insights summary",
            "User quotes and anecdotes"
          ],
          examples: [
            "Retail Store Experience: Observe shoppers in their natural environment",
            "Healthcare Interface: Interview patients about their journey",
            "Financial App: Document how users manage their finances at home"
          ]
        }
      },
      {
        id: "survey",
        name: "Survey Research",
        description: "Quantitative data collection via surveys.",
        basePrice: 4000,
        subElements: [
          {
            id: "surveyDesign",
            name: "Survey Design",
            type: "boolean",
            priceImpact: 1000,
            default: false
          },
          {
            id: "participantRecruitment",
            name: "Participant Recruitment",
            type: "selection",
            options: [
              {value: 0, label: "Use your own participants"},
              {value: 1, label: "100-250 participants"},
              {value: 2, label: "251-500 participants"},
              {value: 3, label: "501-1000 participants"}
            ],
            default: 0,
            priceImpact: 1500
          },
          {
            id: "analysisReport",
            name: "Advanced Analysis & Report",
            type: "boolean",
            priceImpact: 2000,
            default: false
          }
        ],
        metadata: {
          inputs: [
            "Research objectives",
            "Target audience criteria",
            "Existing hypothesis",
            "Key questions to answer"
          ],
          tools: [
            "Survey platforms (SurveyMonkey, Typeform)",
            "Statistical analysis software",
            "Data visualization tools",
            "Panel providers for recruitment"
          ],
          outputs: [
            "Raw survey data",
            "Statistical analysis",
            "Key findings report",
            "Visualized results dashboard"
          ],
          examples: [
            "Product Satisfaction: Measure NPS across customer segments",
            "Feature Prioritization: Quantify user preferences for roadmap planning",
            "Market Research: Assess brand awareness and perception"
          ]
        }
      },
      {
        id: "synthesis",
        name: "Research Synthesis",
        description: "Converting data into actionable insights.",
        basePrice: 3500,
        subElements: [
          {
            id: "affinityMapping",
            name: "Affinity Mapping Workshop",
            type: "boolean",
            priceImpact: 1200,
            default: false
          },
          {
            id: "personaDevelopment",
            name: "Persona Development",
            type: "quantity",
            priceImpact: 1000,
            default: 0,
            min: 0,
            max: 5
          },
          {
            id: "journeyMapping",
            name: "Customer Journey Mapping",
            type: "boolean",
            priceImpact: 1800,
            default: false
          },
          {
            id: "insightReport",
            name: "Comprehensive Insight Report",
            type: "boolean",
            priceImpact: 2500,
            default: false
          }
        ],
        metadata: {
          inputs: [
            "Raw research data",
            "Interview transcripts",
            "Survey results",
            "Field notes"
          ],
          tools: [
            "Miro/Mural for affinity mapping",
            "Synthesis frameworks",
            "Pattern recognition techniques",
            "Visualization software"
          ],
          outputs: [
            "Key insights summary",
            "User personas",
            "Journey maps",
            "Opportunity areas",
            "Recommendations"
          ],
          examples: [
            "Product Redesign: Identify pain points and opportunities from user research",
            "Service Blueprint: Map the entire customer experience across touchpoints",
            "Strategic Planning: Turn research into actionable product roadmap"
          ]
        }
      },
      {
        id: "contingency",
        name: "Contingency",
        description: "Risk management buffer to account for unexpected challenges and scope refinements.",
        basePrice: 0,
        subElements: [
          {
            id: "contingencyRate",
            name: "Contingency Rate",
            type: "selection",
            options: [
              {value: 0, label: "None"},
              {value: 0.05, label: "5%"},
              {value: 0.10, label: "10%"},
              {value: 0.15, label: "15%"},
              {value: 0.20, label: "20%"}
            ],
            default: 0
          }
        ]
      }
    ]
  }
};

const ProposalBuilder = () => {
  // State management
  const [selectedLibrary, setSelectedLibrary] = useState("ai-b-c");
  const [availableComponents, setAvailableComponents] = useState(componentLibraries["ai-b-c"].components);
  const [selectedComponents, setSelectedComponents] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [publishModalVisible, setPublishModalVisible] = useState(false);
  const [publishUrl, setPublishUrl] = useState('');
  const [switchLibraryModalVisible, setSwitchLibraryModalVisible] = useState(false);
  const [pendingLibraryChange, setPendingLibraryChange] = useState(null);
  const dragItem = useRef(null);
  const proposalRef = useRef(null);
  
  // Counter for handling multiple instances of the same component
  const [instanceCounters, setInstanceCounters] = useState({});

  // Update available components when library changes
  useEffect(() => {
    setAvailableComponents(componentLibraries[selectedLibrary].components);
  }, [selectedLibrary]);

  // Handle library change
  const handleLibraryChange = (e) => {
    const newLibrary = e.target.value;
    
    // If there are selected components, show confirmation modal
    if (selectedComponents.length > 0) {
      setPendingLibraryChange(newLibrary);
      setSwitchLibraryModalVisible(true);
    } else {
      // If no components, just switch directly
      setSelectedLibrary(newLibrary);
      // Reset instance counters
      setInstanceCounters({});
    }
  };

  // Confirm library change
  const confirmLibraryChange = () => {
    // Clear selected components
    setSelectedComponents([]);
    // Change library
    setSelectedLibrary(pendingLibraryChange);
    // Reset instance counters
    setInstanceCounters({});
    // Close modal
    setSwitchLibraryModalVisible(false);
  };

  // Cancel library change
  const cancelLibraryChange = () => {
    setPendingLibraryChange(null);
    setSwitchLibraryModalVisible(false);
  };

  // Initialize a component with default values and unique instance ID
  const initializeComponent = (componentTemplate) => {
    // Create a unique instance ID
    const baseId = componentTemplate.id;
    const counter = instanceCounters[baseId] || 0;
    const instanceId = counter === 0 ? baseId : `${baseId}-${counter}`;
    
    // Update the counter for this component type
    setInstanceCounters(prev => ({
      ...prev,
      [baseId]: counter + 1
    }));
    
    // Create a component instance with default values
    return {
      ...componentTemplate,
      libraryId: selectedLibrary,
      instanceId,
      baseId,
      instanceNumber: counter + 1,
      subElements: componentTemplate.subElements.map(sub => ({
        ...sub,
        value: sub.default
      }))
    };
  };

  // Handle drag start event
  const handleDragStart = (e, componentId) => {
    dragItem.current = componentId;
    // Required for Firefox
    e.dataTransfer.setData('text/plain', componentId);
    e.dataTransfer.effectAllowed = 'copy';
  };

  // Handle drag over event
  const handleDragOver = (e) => {
    e.preventDefault();
    if (proposalRef.current) {
      proposalRef.current.classList.add('drag-over');
    }
  };

  // Handle drag leave event
  const handleDragLeave = () => {
    if (proposalRef.current) {
      proposalRef.current.classList.remove('drag-over');
    }
  };

  // Handle drop event
  const handleDrop = (e) => {
    e.preventDefault();
    if (proposalRef.current) {
      proposalRef.current.classList.remove('drag-over');
    }
    
    const componentId = dragItem.current;
    const componentTemplate = availableComponents.find(c => c.id === componentId);
    
    if (!componentTemplate) {
      console.error('Component not found:', componentId);
      return;
    }
    
    // Check if multiple instances are allowed
    if (!componentTemplate.allowMultiple) {
      // For components that don't allow multiples, check if it already exists
      if (selectedComponents.some(c => c.baseId === componentId)) {
        alert(`${componentTemplate.name} can only be added once to your proposal.`);
        return;
      }
    }
    
    const newComponent = initializeComponent(componentTemplate);
    setSelectedComponents(prev => [...prev, newComponent]);
  };

  // Remove a component from the proposal
  const removeComponent = (instanceId) => {
    setSelectedComponents(prev => prev.filter(c => c.instanceId !== instanceId));
  };

  // Update a sub-element value
  const updateSubElementValue = (instanceId, subElementId, newValue) => {
    setSelectedComponents(prev => 
      prev.map(comp => {
        if (comp.instanceId !== instanceId) return comp;
        
        return {
          ...comp,
          subElements: comp.subElements.map(sub => {
            if (sub.id !== subElementId) return sub;
            
            // Convert value based on type
            let processedValue = newValue;
            if (sub.type === "quantity") {
              processedValue = parseInt(newValue, 10);
              // Enforce min/max constraints
              if (sub.min !== undefined && processedValue < sub.min) {
                processedValue = sub.min;
              }
              if (sub.max !== undefined && processedValue > sub.max) {
                processedValue = sub.max;
              }
            } else if (sub.type === "boolean") {
              processedValue = Boolean(newValue);
            } else if (sub.type === "selection") {
              processedValue = parseFloat(newValue);
            }
            
            return {
              ...sub,
              value: processedValue
            };
          })
        };
      })
    );
  };

  // Increment quantity sub-element
  const incrementSubElement = (instanceId, subElementId) => {
    setSelectedComponents(prev => 
      prev.map(comp => {
        if (comp.instanceId !== instanceId) return comp;
        
        return {
          ...comp,
          subElements: comp.subElements.map(sub => {
            if (sub.id !== subElementId || sub.type !== "quantity") return sub;
            
            let newValue = (sub.value || 0) + 1;
            if (sub.max !== undefined && newValue > sub.max) {
              newValue = sub.max;
            }
            
            return {
              ...sub,
              value: newValue
            };
          })
        };
      })
    );
  };

  // Decrement quantity sub-element
  const decrementSubElement = (instanceId, subElementId) => {
    setSelectedComponents(prev => 
      prev.map(comp => {
        if (comp.instanceId !== instanceId) return comp;
        
        return {
          ...comp,
          subElements: comp.subElements.map(sub => {
            if (sub.id !== subElementId || sub.type !== "quantity") return sub;
            
            let newValue = (sub.value || 0) - 1;
            if (sub.min !== undefined && newValue < sub.min) {
              newValue = sub.min;
            }
            
            return {
              ...sub,
              value: newValue
            };
          })
        };
      })
    );
  };

  // Calculate component price
  const calculateComponentPrice = (component) => {
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
  
  // Toggle proposal modal
  const toggleProposalModal = () => {
    setModalVisible(!modalVisible);
  };
  
  // Toggle publish modal
  const togglePublishModal = () => {
    setPublishModalVisible(!publishModalVisible);
  };
  
  // Handle URL input change
  const handleUrlChange = (e) => {
    setPublishUrl(e.target.value);
  };
  
  // Mock publish to URL function
  const publishToUrl = () => {
    alert(`Proposal would be published to: ${publishUrl}`);
    setPublishModalVisible(false);
  };
  
  // Mock download function
  const downloadProposal = (format) => {
    // Create proposal data
    const proposalData = {
      library: selectedLibrary,
      libraryName: componentLibraries[selectedLibrary].name,
      components: selectedComponents,
      subtotal: calculateSubtotal(),
      contingency: calculateContingency(),
      total: calculateTotal(),
      date: new Date().toISOString()
    };
    
    // In a real implementation, this would generate the appropriate file format
    alert(`Downloading proposal as ${format.toUpperCase()}...`);
    
    // Close the modal
    setPublishModalVisible(false);
  };
  
  // Display component name with instance number if needed
  const getComponentDisplayName = (component) => {
    if (component.allowMultiple && component.instanceNumber > 1) {
      return `${component.name} ${component.instanceNumber}`;
    }
    return component.name;
  };
  
  return (
    <div className="proposal-builder">
      <div className="builder-header py-10 mb-8 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-blue-600 mb-2">Proposal Builder</h1>
              <p className="text-xl text-gray-600">Customize your solution by dragging components into your proposal</p>
            </div>
            
            <div className="library-selector max-w-md">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Component Library
              </label>
              <select 
                className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={selectedLibrary}
                onChange={handleLibraryChange}
              >
                {Object.entries(componentLibraries).map(([key, library]) => (
                  <option key={key} value={key}>{library.name}</option>
                ))}
              </select>
              <p className="mt-1 text-sm text-gray-500">
                {componentLibraries[selectedLibrary].description}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4">
        <div className="builder-layout flex gap-6">
          {/* Component Library */}
          <div className="component-library w-1/4 bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">
              {componentLibraries[selectedLibrary].name} Components
            </h2>
            
            <div className="library-components space-y-4">
              {availableComponents.map(comp => (
                <div 
                  key={comp.id} 
                  className="library-component bg-white border border-gray-200 rounded p-4 cursor-move hover:border-blue-500 transition-colors"
                  draggable="true"
                  onDragStart={(e) => handleDragStart(e, comp.id)}
                >
                  <h3 className="font-semibold text-gray-800 mb-2">{comp.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{comp.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-600 font-medium">{formatCurrency(comp.basePrice)}</span>
                    {comp.allowMultiple && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        Multiple allowed
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Proposal Frame */}
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
            
            {/* Selected Components */}
            <div className="selected-components space-y-6">
              {selectedComponents.map(component => (
                <div key={component.instanceId} className="component bg-white border border-gray-200 rounded-lg shadow-sm p-4">
                  <div className="component-header flex justify-between items-center mb-3">
                    <h3 className="text-md font-semibold text-gray-800">{getComponentDisplayName(component)}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm bg-gray-100 text-blue-600 py-1 px-2 rounded">
                        Base: {formatCurrency(component.basePrice)}
                      </span>
                      <button 
                        className="text-gray-400 hover:text-red-500 font-bold w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100"
                        onClick={() => removeComponent(component.instanceId)}
                        aria-label="Remove component"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                  
                  {component.metadata && (
                    <div className="component-metadata mb-4 text-sm">
                      <div className="grid grid-cols-2 gap-4">
                        {component.metadata.inputs && (
                          <div>
                            <h4 className="font-medium text-gray-700 mb-1">Inputs:</h4>
                            <ul className="list-disc pl-4 text-gray-600">
                              {component.metadata.inputs.slice(0, 3).map((input, idx) => (
                                <li key={idx}>{input}</li>
                              ))}
                              {component.metadata.inputs.length > 3 && (
                                <li>+ {component.metadata.inputs.length - 3} more</li>
                              )}
                            </ul>
                          </div>
                        )}
                        
                        {component.metadata.outputs && (
                          <div>
                            <h4 className="font-medium text-gray-700 mb-1">Outputs:</h4>
                            <ul className="list-disc pl-4 text-gray-600">
                              {component.metadata.outputs.slice(0, 3).map((output, idx) => (
                                <li key={idx}>{output}</li>
                              ))}
                              {component.metadata.outputs.length > 3 && (
                                <li>+ {component.metadata.outputs.length - 3} more</li>
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="sub-elements space-y-3">
                    {component.subElements.map(sub => {
                      if (sub.type === "quantity") {
                        // Check for volume discount
                        const showVolumeDiscount = sub.hasVolumeDiscount && component.baseId === "powerHour" && sub.id === "hours";
                        let discountMessage = "";
                        let finalPrice = sub.priceImpact * (sub.value || 0);
                        
                        if (showVolumeDiscount) {
                          const hours = sub.value || 0;
                          if (hours >= 10) {
                            discountMessage = "10% discount applied";
                            finalPrice = finalPrice * 0.9;
                          } else if (hours >= 5) {
                            discountMessage = "5% discount applied";
                            finalPrice = finalPrice * 0.95;
                          }
                        }
                        
                        return (
                          <div key={sub.id}>
                            <div className="sub-element flex justify-between items-center">
                              <div className="flex items-center">
                                <span className="font-medium text-gray-700">{sub.name}</span>
                                {showVolumeDiscount && (
                                  <span className="ml-2 text-xs text-blue-600">
                                    (5+ hours: 5% off, 10+ hours: 10% off)
                                  </span>
                                )}
                                <div className="quantity-controls ml-3 flex items-center">
                                  <button 
                                    className="w-6 h-6 bg-gray-100 border border-gray-300 rounded-l-md flex items-center justify-center hover:bg-gray-200"
                                    onClick={() => decrementSubElement(component.instanceId, sub.id)}
                                    disabled={(sub.value || 0) <= (sub.min || 0)}
                                  >
                                    −
                                  </button>
                                  <input
                                    type="number"
                                    className="w-12 text-center bg-gray-50 border-t border-b border-gray-300"
                                    value={sub.value || 0}
                                    min={sub.min}
                                    max={sub.max}
                                    onChange={(e) => updateSubElementValue(component.instanceId, sub.id, e.target.value)}
                                  />
                                  <button 
                                    className="w-6 h-6 bg-gray-100 border border-gray-300 rounded-r-md flex items-center justify-center hover:bg-gray-200"
                                    onClick={() => incrementSubElement(component.instanceId, sub.id)}
                                    disabled={sub.max !== undefined && (sub.value || 0) >= sub.max}
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                              <span className="text-sm text-gray-600">
                                {formatCurrency(sub.priceImpact)} × {sub.value || 0} = {formatCurrency(finalPrice)}
                              </span>
                            </div>
                            {discountMessage && (
                              <div className="ml-6 mb-2 text-sm text-green-600">
                                {discountMessage}
                              </div>
                            )}
                          </div>
                        );
                      }
                      
                      if (sub.type === "boolean") {
                        return (
                          <div key={sub.id} className="sub-element flex justify-between items-center">
                            <div className="flex items-center">
                              <input 
                                type="checkbox" 
                                checked={sub.value || false}
                                onChange={(e) => updateSubElementValue(component.instanceId, sub.id, e.target.checked)}
                                className="mr-2 text-blue-600"
                              />
                              <span className="text-gray-700">{sub.name}</span>
                            </div>
                            <span className="text-sm text-gray-600">{sub.value ? formatCurrency(sub.priceImpact) : '£0'}</span>
                          </div>
                        );
                      }
                      
                      if (sub.type === "selection") {
                        // Calculate price based on selection multiplier if applicable
                        let selectionPrice = sub.priceImpact;
                        if (sub.value && sub.priceImpact) {
                          if (typeof sub.value === 'number' && sub.value > 0) {
                            selectionPrice = sub.priceImpact * sub.value;
                          }
                        }
                        
                        return (
                          <div key={sub.id} className="sub-element flex justify-between items-center">
                            <span className="text-gray-700">{sub.name}</span>
                            <div className="flex items-center gap-3">
                              <select 
                                className="border border-gray-300 rounded p-1 bg-white"
                                value={sub.value || 0}
                                onChange={(e) => updateSubElementValue(component.instanceId, sub.id, e.target.value)}
                              >
                                {sub.options.map(opt => (
                                  <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </option>
                                ))}
                              </select>
                              <span className="text-sm text-gray-600">{formatCurrency(selectionPrice)}</span>
                            </div>
                          </div>
                        );
                      }
                      
                      return null;
                    })}
                  </div>
                  
                  <div className="component-total mt-3 pt-2 border-t border-gray-100 flex justify-between">
                    <span className="font-medium text-gray-700">Component Total:</span>
                    <span className="font-semibold text-blue-600">{formatCurrency(calculateComponentPrice(component))}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Proposal Summary */}
          <div className="proposal-summary w-1/4 bg-white rounded-lg shadow-md p-4 h-fit sticky top-4">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Proposal Summary</h2>
            
            <div className="text-sm text-gray-600 mb-4">
              <span className="font-medium">Type:</span> {componentLibraries[selectedLibrary].name}
            </div>
            
            <div className="summary-table space-y-3 mb-6">
              {/* Power Hour Summary with Discount */}
              {selectedComponents.filter(c => c.baseId === "powerHour").length > 0 && (
                <div className="border-b border-gray-200 pb-3 mb-3">
                  {selectedComponents.filter(c => c.baseId === "powerHour").map(ph => {
                    const hoursSubElement = ph.subElements.find(s => s.id === "hours");
                    const hours = hoursSubElement ? hoursSubElement.value || 0 : 0;
                    let hourlyRate = 300;
                    let discountPercent = 0;
                    
                    if (hours >= 10) {
                      hourlyRate = 270; // 10% off
                      discountPercent = 10;
                    } else if (hours >= 5) {
                      hourlyRate = 285; // 5% off
                      discountPercent = 5;
                    }
                    
                    const totalPrice = hourlyRate * hours;
                    
                    return (
                      <div key={ph.instanceId} className="space-y-1">
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-700">Power Hour ({hours} hours)</span>
                          <span>{formatCurrency(totalPrice)}</span>
                        </div>
                        {discountPercent > 0 && (
                          <div className="flex justify-between text-sm text-green-600">
                            <span>{discountPercent}% volume discount applied</span>
                            <span>(-{formatCurrency(hours * 300 * (discountPercent/100))})</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
              
              <div className="summary-row flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">{formatCurrency(calculateSubtotal())}</span>
              </div>
              
              <div className="summary-row flex justify-between">
                <span className="text-gray-600">Contingency ({getContingencyRate()}):</span>
                <span className="font-medium">{formatCurrency(calculateContingency())}</span>
              </div>
              
              <div className="summary-row flex justify-between border-t border-gray-200 pt-2 mt-2">
                <span className="font-semibold text-gray-800">TOTAL:</span>
                <span className="font-bold text-lg text-blue-600">{formatCurrency(calculateTotal())}</span>
              </div>
            </div>
            
            <div className="button-group space-y-2">
              <button 
                className="w-full bg-white border-2 border-blue-600 text-blue-600 font-medium py-2 px-4 rounded transition-colors hover:bg-blue-50"
                onClick={toggleProposalModal}
              >
                PREVIEW PROPOSAL
              </button>
              
              <button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
                onClick={togglePublishModal}
              >
                PUBLISH PROPOSAL
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Proposal Preview Modal */}
      {modalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-3/4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Complete Proposal</h2>
                <p className="text-sm text-gray-600">{componentLibraries[selectedLibrary].name}</p>
              </div>
              <button 
                className="text-gray-500 hover:text-gray-700 text-xl"
                onClick={toggleProposalModal}
              >
                ×
              </button>
            </div>
            
            <div className="p-6">
              <div className="proposal-content space-y-6">
                {selectedComponents
                  .filter(comp => comp.baseId !== "genericInfo")
                  .map(component => {
                    const isContingency = component.baseId === "contingency";
                    const compPrice = calculateComponentPrice(component);
                    
                    return (
                      <div key={component.instanceId} className="component-summary pb-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold mb-2 text-blue-600">{getComponentDisplayName(component)}</h3>
                        
                        {component.metadata && (
                          <div className="mb-3 p-3 bg-gray-50 rounded-md">
                            {component.metadata.examples && component.metadata.examples.length > 0 && (
                              <div className="mb-2">
                                <h4 className="text-sm font-medium text-gray-700">Example Use Case:</h4>
                                <p className="text-sm text-gray-600">{component.metadata.examples[Math.floor(Math.random() * component.metadata.examples.length)]}</p>
                              </div>
                            )}
                            
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              {component.metadata.inputs && (
                                <div>
                                  <span className="font-medium text-gray-700">Inputs:</span>{' '}
                                  <span className="text-gray-600">{component.metadata.inputs.slice(0, 2).join(', ')}{component.metadata.inputs.length > 2 ? '...' : ''}</span>
                                </div>
                              )}
                              
                              {component.metadata.outputs && (
                                <div>
                                  <span className="font-medium text-gray-700">Outputs:</span>{' '}
                                  <span className="text-gray-600">{component.metadata.outputs.slice(0, 2).join(', ')}{component.metadata.outputs.length > 2 ? '...' : ''}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {/* Special handling for Power Hour - no base price display */}
                        {!isContingency && component.baseId !== "powerHour" && (
                          <div className="flex justify-between text-sm text-gray-600 mb-2">
                            <span>Base Price</span>
                            <span>{formatCurrency(component.basePrice)}</span>
                          </div>
                        )}
                        
                        {component.subElements.map(sub => {
                          if (sub.type === "quantity" && (sub.value || 0) > 0) {
                            // Check for volume discount
                            let price = sub.priceImpact * sub.value;
                            let discountText = "";
                            
                            if (sub.hasVolumeDiscount && component.baseId === "powerHour" && sub.id === "hours") {
                              const hours = sub.value;
                              if (hours >= 10) {
                                discountText = " (10% discount)";
                                price = price * 0.9;
                              } else if (hours >= 5) {
                                discountText = " (5% discount)";
                                price = price * 0.95;
                              }
                            }
                            
                            return (
                              <div key={sub.id} className="flex justify-between py-1">
                                <span className="text-gray-700">
                                  {sub.name} × {sub.value}{discountText}
                                </span>
                                <span>{formatCurrency(price)}</span>
                              </div>
                            );
                          }
                          
                          if (sub.type === "boolean" && sub.value) {
                            return (
                              <div key={sub.id} className="flex justify-between py-1">
                                <span className="text-gray-700">{sub.name}</span>
                                <span>{formatCurrency(sub.priceImpact)}</span>
                              </div>
                            );
                          }
                          
                          if (sub.type === "selection" && sub.id === "contingencyRate" && sub.value > 0) {
                            return (
                              <div key={sub.id} className="flex justify-between py-1">
                                <span className="text-gray-700">Rate: {sub.value * 100}%</span>
                                <span>{formatCurrency(calculateContingency())}</span>
                              </div>
                            );
                          }
                          
                          if (sub.type === "selection" && sub.value && typeof sub.value === 'number' && sub.value > 0) {
                            const option = sub.options.find(opt => opt.value === parseFloat(sub.value));
                            return (
                              <div key={sub.id} className="flex justify-between py-1">
                                <span className="text-gray-700">{sub.name}: {option ? option.label : ''}</span>
                                <span>{formatCurrency(sub.priceImpact * sub.value)}</span>
                              </div>
                            );
                          }
                          
                          return null;
                        })}
                        
                        {!isContingency && (
                          <div className="flex justify-between font-semibold mt-2 pt-1 border-t border-gray-100">
                            <span className="text-gray-800">Component Total</span>
                            <span className="text-blue-600">{formatCurrency(compPrice)}</span>
                          </div>
                        )}
                      </div>
                    );
                })}
                
                {/* Final Summary */}
                <div className="final-summary pt-4">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium text-gray-700">Subtotal</span>
                    <span>{formatCurrency(calculateSubtotal())}</span>
                  </div>
                  
                  <div className="flex justify-between mb-4">
                    <span className="font-medium text-gray-700">Contingency ({getContingencyRate()})</span>
                    <span>{formatCurrency(calculateContingency())}</span>
                  </div>
                  
                  <div className="flex justify-between text-xl font-bold pt-2 border-t border-gray-200">
                    <span className="text-gray-800">TOTAL</span>
                    <span className="text-blue-600">{formatCurrency(calculateTotal())}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Publish Modal */}
      {publishModalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-1/3 max-w-md">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">Publish Proposal</h2>
              <button 
                className="text-gray-500 hover:text-gray-700 text-xl"
                onClick={togglePublishModal}
              >
                ×
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="url-publish">
                <h3 className="text-lg font-medium mb-3 text-gray-800">Publish to URL</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter destination URL"
                    className="flex-1 border border-gray-300 rounded p-2"
                    value={publishUrl}
                    onChange={handleUrlChange}
                  />
                  <button 
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    onClick={publishToUrl}
                    disabled={!publishUrl}
                  >
                    Push
                  </button>
                </div>
              </div>
              
              <div className="download-options">
                <h3 className="text-lg font-medium mb-3 text-gray-800">Download Proposal</h3>
                <div className="grid grid-cols-3 gap-2">
                  <button 
                    className="bg-white border border-gray-300 hover:bg-gray-50 py-2 rounded font-medium"
                    onClick={() => downloadProposal('pdf')}
                  >
                    PDF
                  </button>
                  <button 
                    className="bg-white border border-gray-300 hover:bg-gray-50 py-2 rounded font-medium"
                    onClick={() => downloadProposal('docx')}
                  >
                    Word
                  </button>
                  <button 
                    className="bg-white border border-gray-300 hover:bg-gray-50 py-2 rounded font-medium"
                    onClick={() => downloadProposal('json')}
                  >
                    JSON
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Library Switch Confirmation Modal */}
      {switchLibraryModalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-1/3 max-w-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Change Component Library?</h2>
            <p className="text-gray-600 mb-6">
              Changing to {componentLibraries[pendingLibraryChange].name} will remove all current components from your proposal. Are you sure you want to continue?
            </p>
            
            <div className="flex justify-end gap-2">
              <button 
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                onClick={cancelLibraryChange}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={confirmLibraryChange}
              >
                Change Library
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* CSS for drag-over effect */}
      <style jsx>{`
        .drag-over {
          background-color: #f0f9ff;
          border-color: #2563eb;
          border-style: solid;
        }
      `}</style>
    </div>
  );
};

export default ProposalBuilder;