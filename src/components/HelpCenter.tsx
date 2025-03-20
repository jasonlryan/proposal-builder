import React, { useState } from "react";
import "./styles/help.css";
import "../components/styles/admin.css"; // Import the common admin styles

// Help content configuration - edit this object to update the help content
const helpContent = {
  title: "User Guide",
  sections: [
    {
      id: "introduction",
      title: "Introduction",
      content:
        "Welcome to the Proposal Builder tool, designed to help you create professional client proposals quickly and efficiently. This guide will walk you through the main features and how to use them effectively.",
      subsections: [],
    },
    {
      id: "getting-started",
      title: "Getting Started",
      content:
        "The Proposal Builder allows you to create custom proposals by combining pre-built components. These components represent various services and deliverables that can be included in your proposal. Each component has configurable options and pricing.",
      subsections: [
        {
          title: "Key Features",
          content:
            "• Create professional proposals in minutes\n• Calculate pricing automatically\n• Customize components to match client needs\n• Preview proposals before publishing\n• Export proposals in various formats",
        },
        {
          title: "Navigation",
          content:
            "The application has three main sections:\n• Builder: Create and customize proposals\n• Edit Components: Manage the component library\n• Help: Access this user guide",
        },
      ],
    },
    {
      id: "creating-proposals",
      title: "Creating Proposals",
      content: "To create a proposal, follow these steps:",
      subsections: [
        {
          title: "Step 1: Select a Component Library",
          content:
            "Choose the appropriate component library from the dropdown menu on the left panel.",
        },
        {
          title: "Step 2: Add Components",
          content:
            "Drag components from the left panel into your proposal area. You can add multiple components to build a comprehensive proposal.",
        },
        {
          title: "Step 3: Configure Components",
          content:
            "Each added component can be configured with specific options:\n• Boolean options (checkboxes) for including/excluding features\n• Quantity selectors for volume-based services\n• Dropdown menus for selecting specific options\n\nAs you configure components, the pricing will automatically update.",
        },
        {
          title: "Step 4: Review and Adjust",
          content:
            "Review the components and their configurations. You can remove components by clicking the X icon, or reorder them by dragging them to a new position.",
        },
        {
          title: "Special Feature: Power Hour Discounts",
          content:
            "Power Hour components include automatic volume discounts:\n• 5-9 hours: 5% discount\n• 10+ hours: 10% discount\n\nThese discounts are automatically applied and shown in the proposal summary.",
        },
      ],
    },
    {
      id: "previewing-publishing",
      title: "Previewing and Publishing",
      content:
        "Once you've built your proposal, you can preview and publish it:",
      subsections: [
        {
          title: "Previewing",
          content:
            "Click the 'Preview Proposal' button in the right panel to see how your proposal will appear to clients. This view includes:\n• All components with their configurations\n• Price breakdowns for each component\n• Subtotal, discounts, and total price",
        },
        {
          title: "Exporting",
          content:
            "From the preview mode, you can export your proposal in different formats:\n• PDF: For sharing or printing\n• Word: For further editing\n• JSON: For technical integrations",
        },
        {
          title: "Publishing",
          content:
            "Click the 'Publish Proposal' button to finalize your proposal. This will create a shareable version that can be sent to clients.",
        },
      ],
    },
    {
      id: "editing-components",
      title: "Editing Components",
      content:
        "Access the component editor via the 'Edit Components' navigation link. Here you can:",
      subsections: [
        {
          title: "Component Management",
          content:
            "• Create new components\n• Edit existing components\n• Set base prices\n• Configure available options\n• Define price impacts for each option",
        },
        {
          title: "Component Libraries",
          content:
            "Components are organized into libraries. You can:\n• Switch between different libraries\n• Create new libraries for different types of services\n• Manage existing libraries",
        },
        {
          title: "Backups",
          content:
            "The system automatically creates backups when you save changes. You can restore from these backups if needed.",
        },
      ],
    },
    {
      id: "tips-tricks",
      title: "Tips & Best Practices",
      content:
        "Here are some tips for getting the most out of the Proposal Builder:",
      subsections: [
        {
          title: "Creating Effective Proposals",
          content:
            "• Start with core services, then add optional extras\n• Use clear descriptions for each component\n• Include contingency for complex projects\n• Review pricing carefully before sending to clients",
        },
        {
          title: "Time-Saving Techniques",
          content:
            "• Create template proposals for common project types\n• Customize a few key components rather than starting from scratch\n• Use the preview feature to check your work frequently",
        },
      ],
    },
  ],
};

const HelpCenter: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>("introduction");

  return (
    <div className="component-editor">
      <div className="editor-header">
        <h2>{helpContent.title}</h2>
        <p>Learn how to use the Proposal Builder tool and its features</p>
      </div>

      <div className="help-layout">
        <div className="help-sidebar">
          <div className="toc-container">
            <h3>Table of Contents</h3>
            <ul className="toc-list">
              {helpContent.sections.map((section) => (
                <li
                  key={section.id}
                  className={activeSection === section.id ? "active" : ""}
                  onClick={() => setActiveSection(section.id)}
                >
                  {section.title}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="help-content-wrapper">
          {helpContent.sections.map((section) => (
            <div
              key={section.id}
              className={`help-section ${
                activeSection === section.id ? "active" : "hidden"
              }`}
              id={section.id}
            >
              <h2 className="section-title">{section.title}</h2>
              <p className="section-content">{section.content}</p>

              {section.subsections && section.subsections.length > 0 && (
                <>
                  {section.subsections.map((subsection, index) => (
                    <div key={index} className="subsection">
                      <h3 className="subsection-title">{subsection.title}</h3>
                      <div className="subsection-content">
                        {subsection.content.split("\n").map((line, i) => (
                          <p key={i}>{line}</p>
                        ))}
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
