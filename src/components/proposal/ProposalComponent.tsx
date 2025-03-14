import React from "react";
import { ProposalComponent as ProposalComponentType } from "../../context/ProposalContext";
import { usePricing } from "../../hooks/usePricing";
import SubElementConfig from "./SubElementConfig";
import "../styles/price-indicators.css";

interface ProposalComponentProps {
  component: ProposalComponentType;
  onRemove: (instanceId: string) => void;
}

const ProposalComponent: React.FC<ProposalComponentProps> = ({
  component,
  onRemove,
}) => {
  const { calculateComponentPrice, formatCurrency } = usePricing();

  // Calculate total price for this component
  const totalPrice = calculateComponentPrice(component);

  return (
    <div
      className="proposal-component"
      style={{
        backgroundColor: "white",
        borderRadius: "0.375rem",
        padding: "1rem",
        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        border: "1px solid #e5e7eb",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div>
          <h3
            style={{
              fontSize: "1.125rem",
              fontWeight: "500",
              marginBottom: "0.5rem",
              color: "#111827",
            }}
          >
            {component.name}
          </h3>
          <p
            style={{
              fontSize: "0.875rem",
              color: "#4b5563",
              marginBottom: "0.5rem",
            }}
          >
            {component.description}
          </p>
          <div className="price-breakdown">
            <div className="base-price">
              Base Price: {formatCurrency(component.basePrice)}
              {totalPrice > component.basePrice && (
                <span className="price-indicator add-on-price">
                  (+ {formatCurrency(totalPrice - component.basePrice)} in
                  add-ons)
                </span>
              )}
            </div>
            <div className="total-price">
              Total: {formatCurrency(totalPrice)}
            </div>
          </div>
        </div>

        <div>
          <button
            onClick={() => onRemove(component.instanceId)}
            style={{
              color: "#ef4444",
              background: "transparent",
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
