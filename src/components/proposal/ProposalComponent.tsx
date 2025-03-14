import React from "react";
import {
  useProposalContext,
  ProposalComponent as ProposalComponentType,
} from "../../context/ProposalContext";
import { usePricing } from "../../hooks/usePricing";
import SubElementConfig from "./SubElementConfig";

interface ProposalComponentProps {
  component: ProposalComponentType;
}

const ProposalComponent: React.FC<ProposalComponentProps> = ({ component }) => {
  const { removeComponent } = useProposalContext();
  const { calculateComponentPrice, formatCurrency } = usePricing();

  const componentPrice = calculateComponentPrice(component);

  return (
    <div
      className="proposal-component"
      style={{
        backgroundColor: "white",
        border: "1px solid #e5e7eb",
        borderRadius: "0.5rem",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        padding: "1rem",
        transition: "all 0.2s ease",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "0.75rem",
        }}
      >
        <div>
          <h3
            style={{
              fontWeight: 600,
              color: "#1f2937",
              fontSize: "1rem",
              marginBottom: "0.25rem",
            }}
          >
            {component.name}
          </h3>
          <p
            style={{
              fontSize: "0.875rem",
              color: "#6b7280",
            }}
          >
            {component.description}
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <span
            style={{
              color: "var(--bn-blue)",
              fontWeight: 500,
              marginRight: "1rem",
            }}
          >
            {formatCurrency(componentPrice)}
          </span>
          <button
            onClick={() => removeComponent(component.instanceId)}
            style={{
              color: "#ef4444",
              backgroundColor: "transparent",
              border: "none",
              padding: "0.25rem",
              cursor: "pointer",
              borderRadius: "0.25rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background-color 0.2s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#fee2e2";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
            aria-label="Remove component"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              style={{ height: "1.25rem", width: "1.25rem" }}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>

      <div style={{ marginTop: "0.75rem" }}>
        {component.subElements.map((subElement) => (
          <SubElementConfig
            key={subElement.id}
            instanceId={component.instanceId}
            subElement={subElement}
          />
        ))}
      </div>
    </div>
  );
};

export default ProposalComponent;
