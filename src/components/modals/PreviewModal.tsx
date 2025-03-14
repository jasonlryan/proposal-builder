import React from "react";
import { useProposalContext } from "../../context/ProposalContext";
import { usePricing } from "../../hooks/usePricing";

interface PreviewModalProps {
  onClose: () => void;
  onDownload: (format: "pdf" | "word" | "json") => void;
}

const PreviewModal: React.FC<PreviewModalProps> = ({ onClose, onDownload }) => {
  const { selectedComponents } = useProposalContext();
  const {
    calculateComponentPrice,
    calculateSubtotal,
    calculateContingency,
    calculateTotal,
    formatCurrency,
  } = usePricing();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-3/4 max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Proposal Preview</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-blue-200 transition-colors"
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-grow">
          <div className="proposal-preview">
            <h1 className="text-2xl font-bold mb-6">Project Proposal</h1>

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 border-b pb-2">
                Components
              </h2>

              {selectedComponents
                .filter(
                  (c) =>
                    c.baseId !== "contingency" && c.baseId !== "genericInfo"
                )
                .map((component) => (
                  <div
                    key={component.instanceId}
                    className="mb-6 p-4 border border-gray-200 rounded-lg"
                  >
                    <h3 className="text-lg font-medium mb-2">
                      {component.name}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {component.description}
                    </p>

                    {component.subElements.length > 0 && (
                      <div className="mt-3">
                        <h4 className="text-sm font-medium mb-2">
                          Configuration:
                        </h4>
                        <ul className="text-sm text-gray-600 space-y-1 ml-4">
                          {component.subElements.map((sub) => {
                            let valueDisplay = "";

                            if (sub.type === "boolean") {
                              valueDisplay = sub.value ? "Yes" : "No";
                            } else if (
                              sub.type === "selection" &&
                              sub.options
                            ) {
                              const option = sub.options.find(
                                (opt) => opt.value === sub.value
                              );
                              valueDisplay = option ? option.label : "";
                            } else {
                              valueDisplay = String(sub.value || 0);
                            }

                            return (
                              <li key={sub.id} className="flex justify-between">
                                <span>{sub.name}:</span>
                                <span className="font-medium">
                                  {valueDisplay}
                                </span>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}

                    <div className="mt-4 text-right">
                      <span className="font-medium">
                        {formatCurrency(calculateComponentPrice(component))}
                      </span>
                    </div>
                  </div>
                ))}
            </div>

            <div className="pricing-summary border-t pt-4">
              <div className="flex justify-between text-lg mb-2">
                <span>Subtotal:</span>
                <span className="font-medium">
                  {formatCurrency(calculateSubtotal())}
                </span>
              </div>

              <div className="flex justify-between text-lg mb-2">
                <span>Contingency:</span>
                <span className="font-medium">
                  {formatCurrency(calculateContingency())}
                </span>
              </div>

              <div className="flex justify-between text-xl font-bold border-t pt-4 mt-2">
                <span>Total:</span>
                <span>{formatCurrency(calculateTotal())}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-100 px-6 py-4 flex justify-end space-x-4">
          <button
            onClick={() => onDownload("pdf")}
            className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition-colors"
          >
            Download PDF
          </button>

          <button
            onClick={() => onDownload("word")}
            className="bg-blue-700 hover:bg-blue-800 text-white py-2 px-4 rounded transition-colors"
          >
            Download Word
          </button>

          <button
            onClick={() => onDownload("json")}
            className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded transition-colors"
          >
            Export JSON
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;
