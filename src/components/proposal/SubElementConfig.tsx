import React from "react";
import {
  useProposalContext,
  ProposalSubElement,
} from "../../context/ProposalContext";
import { usePricing } from "../../hooks/usePricing";

interface SubElementConfigProps {
  instanceId: string;
  subElement: ProposalSubElement;
  showPrice?: boolean;
}

const SubElementConfig: React.FC<SubElementConfigProps> = ({
  instanceId,
  subElement,
  showPrice = false,
}) => {
  const { updateSubElementValue, incrementSubElement, decrementSubElement } =
    useProposalContext();
  const { formatCurrency } = usePricing();

  // Calculate price impact for this sub-element
  const calculatePriceImpact = () => {
    if (!subElement.priceImpact) return 0;

    if (subElement.type === "boolean" && subElement.value) {
      return subElement.priceImpact;
    } else if (subElement.type === "quantity" && subElement.value) {
      return subElement.priceImpact * (subElement.value || 0);
    } else if (subElement.type === "selection" && subElement.value) {
      if (typeof subElement.value === "number" && subElement.value > 0) {
        return subElement.priceImpact * subElement.value;
      } else {
        return subElement.priceImpact;
      }
    }
    return 0;
  };

  const priceImpact = calculatePriceImpact();
  const hasPriceImpact = priceImpact > 0;

  // Render different input types based on sub-element type
  const renderInputControl = () => {
    switch (subElement.type) {
      case "quantity":
        return (
          <div className="flex items-center">
            <button
              onClick={() => decrementSubElement(instanceId, subElement.id)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-600 h-8 w-8 rounded-l flex items-center justify-center transition-colors"
              aria-label="Decrease"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <input
              type="number"
              value={subElement.value || 0}
              onChange={(e) =>
                updateSubElementValue(
                  instanceId,
                  subElement.id,
                  parseInt(e.target.value) || 0
                )
              }
              min={subElement.min || 0}
              max={subElement.max}
              className="h-8 w-16 text-center border-t border-b border-gray-300"
            />
            <button
              onClick={() => incrementSubElement(instanceId, subElement.id)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-600 h-8 w-8 rounded-r flex items-center justify-center transition-colors"
              aria-label="Increase"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        );

      case "boolean":
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              id={`${instanceId}-${subElement.id}`}
              checked={subElement.value || false}
              onChange={(e) =>
                updateSubElementValue(
                  instanceId,
                  subElement.id,
                  e.target.checked
                )
              }
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
        );

      case "selection":
        return (
          <div className="flex items-center">
            <select
              value={subElement.value || ""}
              onChange={(e) => {
                const value = e.target.value;
                // Convert to number if it's a numeric string
                const parsedValue = !isNaN(Number(value))
                  ? Number(value)
                  : value;
                updateSubElementValue(instanceId, subElement.id, parsedValue);
              }}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              {subElement.options?.map((option) => (
                <option key={option.label} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="sub-element-config flex justify-between items-center p-2 bg-gray-50 rounded">
      <div className="flex flex-grow justify-between items-center">
        <label
          htmlFor={`${instanceId}-${subElement.id}`}
          className="text-sm text-gray-700"
        >
          {subElement.name}
          {showPrice && hasPriceImpact && (
            <span
              style={{
                marginLeft: "0.5rem",
                fontSize: "0.75rem",
                color: "var(--bn-blue)",
                fontWeight: "500",
              }}
            >
              (+{formatCurrency(priceImpact)})
            </span>
          )}
        </label>
        {renderInputControl()}
      </div>
    </div>
  );
};

export default SubElementConfig;
