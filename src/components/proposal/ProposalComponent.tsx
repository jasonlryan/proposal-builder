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
    <div className="proposal-component bg-white border border-gray-200 rounded-lg shadow-sm p-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-gray-800">{component.name}</h3>
          <p className="text-sm text-gray-600">{component.description}</p>
        </div>
        <div className="flex items-center">
          <span className="text-blue-600 font-medium mr-4">
            {formatCurrency(componentPrice)}
          </span>
          <button
            onClick={() => removeComponent(component.instanceId)}
            className="text-red-500 hover:text-red-700 transition-colors"
            aria-label="Remove component"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
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

      <div className="sub-elements space-y-3">
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
