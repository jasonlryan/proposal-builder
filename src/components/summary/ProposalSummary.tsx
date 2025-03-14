import React from "react";
import { useProposalContext } from "../../context/ProposalContext";
import { usePricing } from "../../hooks/usePricing";

interface ProposalSummaryProps {
  onPreview: () => void;
  onPublish: () => void;
}

const ProposalSummary: React.FC<ProposalSummaryProps> = ({
  onPreview,
  onPublish,
}) => {
  const { selectedComponents } = useProposalContext();
  const {
    calculateSubtotal,
    calculateContingency,
    calculateTotal,
    formatCurrency,
    getContingencyRate,
  } = usePricing();

  const subtotal = calculateSubtotal();
  const contingency = calculateContingency();
  const total = calculateTotal();

  return (
    <div className="proposal-summary w-full md:w-1/3 lg:w-1/4 bg-white rounded-lg shadow-md p-4">
      <h2 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">
        Proposal Summary
      </h2>

      <div className="summary-content">
        <div className="components-list mb-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Selected Components:
          </h3>
          {selectedComponents.length === 0 ? (
            <p className="text-sm text-gray-500 italic">
              No components selected
            </p>
          ) : (
            <ul className="text-sm text-gray-600 space-y-1">
              {selectedComponents
                .filter(
                  (c) =>
                    c.baseId !== "contingency" && c.baseId !== "genericInfo"
                )
                .map((component) => (
                  <li
                    key={component.instanceId}
                    className="flex justify-between"
                  >
                    <span>{component.name}</span>
                  </li>
                ))}
            </ul>
          )}
        </div>

        <div className="pricing-summary space-y-2 border-t pt-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-medium">{formatCurrency(subtotal)}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-600">
              Contingency ({getContingencyRate()}):
            </span>
            <span className="font-medium">{formatCurrency(contingency)}</span>
          </div>

          <div className="flex justify-between text-base font-bold border-t pt-2 mt-2">
            <span>Total:</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>

        <div className="actions mt-6 space-y-3">
          <button
            onClick={onPreview}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
            disabled={selectedComponents.length === 0}
          >
            Preview Proposal
          </button>

          <button
            onClick={onPublish}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition-colors disabled:bg-green-300 disabled:cursor-not-allowed"
            disabled={selectedComponents.length === 0}
          >
            Publish Proposal
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProposalSummary;
