import React, { useEffect } from "react";
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

  // Prevent body scrolling when modal is open
  useEffect(() => {
    // Save the original overflow value
    const originalOverflow = document.body.style.overflow;

    // Prevent scrolling on mount
    document.body.style.overflow = "hidden";

    // Re-enable scrolling on unmount
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Function to calculate price impact for each subelement
  const calculateSubElementPrice = (component: any, subElement: any) => {
    if (!subElement.priceImpact && subElement.priceImpact !== 0) return 0;

    if (subElement.type === "quantity" && subElement.value) {
      let itemPrice = subElement.priceImpact * (subElement.value || 0);

      // Apply volume discount for Power Hour
      if (
        subElement.hasVolumeDiscount &&
        component.baseId === "powerHour" &&
        subElement.id === "hours"
      ) {
        const hours = subElement.value || 0;
        if (hours >= 10) {
          // 10% discount for 10+ hours
          itemPrice = itemPrice * 0.9;
        } else if (hours >= 5) {
          // 5% discount for 5-9 hours
          itemPrice = itemPrice * 0.95;
        }
      }

      return itemPrice;
    } else if (subElement.type === "boolean" && subElement.value) {
      return subElement.priceImpact;
    } else if (
      subElement.type === "selection" &&
      subElement.value &&
      (subElement.priceImpact || subElement.priceImpact === 0)
    ) {
      // For selections with multipliers
      if (typeof subElement.value === "number" && subElement.value > 0) {
        return subElement.priceImpact * subElement.value;
      } else {
        return subElement.priceImpact;
      }
    }
    return 0;
  };

  // Function to get discount information for Power Hour
  const getPowerHourDiscount = (component: any, subElement: any) => {
    if (
      component.baseId === "powerHour" &&
      subElement.id === "hours" &&
      subElement.hasVolumeDiscount &&
      subElement.value
    ) {
      const hours = subElement.value || 0;
      const fullPrice = subElement.priceImpact * hours;
      const discountedPrice = calculateSubElementPrice(component, subElement);
      const discountAmount = fullPrice - discountedPrice;

      if (hours >= 10) {
        return {
          percentage: "10%",
          amount: discountAmount || 0,
          applied: true,
        };
      } else if (hours >= 5) {
        return {
          percentage: "5%",
          amount: discountAmount || 0,
          applied: true,
        };
      }
    }

    return { applied: false, amount: 0, percentage: "" };
  };

  // Function to check if a subelement should be shown (either has price impact or is active)
  const shouldShowSubElement = (component: any, subElement: any) => {
    // Show elements with price impact
    const price = calculateSubElementPrice(component, subElement);
    if (price > 0) return true;

    // Also show active boolean elements even if they don't have price impact
    if (subElement.type === "boolean" && subElement.value) return true;

    // Show quantity elements with non-zero values
    if (subElement.type === "quantity" && subElement.value > 0) return true;

    // Show selection elements with non-empty values
    if (subElement.type === "selection" && subElement.value) return true;

    return false;
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{
        zIndex: 99999,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      }}
    >
      <div
        className="bg-white rounded-lg shadow-2xl w-11/12 md:w-3/4 max-w-4xl flex flex-col"
        style={{
          maxHeight: "90vh",
          position: "relative",
          top: "0",
          overflow: "hidden",
        }}
      >
        <div
          className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center"
          style={{ position: "sticky", top: 0, zIndex: 10 }}
        >
          <h2 className="text-xl font-semibold">Proposal Preview</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-blue-200 transition-colors p-2"
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

        <div
          className="overflow-y-auto"
          style={{ maxHeight: "calc(90vh - 140px)" }}
        >
          <div className="proposal-preview p-6">
            <h1 className="text-2xl font-bold mb-4">Project Proposal</h1>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3 border-b pb-2">
                Components
              </h2>

              {selectedComponents
                .filter(
                  (c) =>
                    c.baseId !== "contingency" && c.baseId !== "genericInfo"
                )
                .map((component) => {
                  // Get price breakdown
                  const componentPrice = calculateComponentPrice(component);

                  // Get active sub elements that should be shown
                  const activeSubElements = component.subElements.filter(
                    (sub) => shouldShowSubElement(component, sub)
                  );

                  return (
                    <div
                      key={component.instanceId}
                      className="mb-4 p-3 border border-gray-200 rounded-lg"
                    >
                      <h3 className="text-lg font-medium mb-1">
                        {component.name}
                      </h3>
                      <p className="text-gray-600 mb-2 text-sm">
                        {component.description}
                      </p>

                      {/* Always show configuration section */}
                      <div className="mt-2">
                        <h4 className="text-sm font-medium mb-1">
                          Configuration & Price:
                        </h4>
                        <div className="border-t pt-2">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Base Price:</span>
                            <span className="font-medium">
                              {formatCurrency(component.basePrice)}
                            </span>
                          </div>

                          {activeSubElements.map((sub) => {
                            const price = calculateSubElementPrice(
                              component,
                              sub
                            );

                            // Check if this is a Power Hour component with discount
                            const discount = getPowerHourDiscount(
                              component,
                              sub
                            );

                            let valueDisplay = "";
                            if (sub.type === "boolean") {
                              valueDisplay = "";
                            } else if (
                              sub.type === "selection" &&
                              sub.options
                            ) {
                              const option = sub.options.find(
                                (opt) => opt.value === sub.value
                              );
                              valueDisplay = option ? ` (${option.label})` : "";
                            } else if (sub.type === "quantity") {
                              valueDisplay = ` (${sub.value})`;
                            }

                            return (
                              <React.Fragment key={sub.id}>
                                <div className="flex justify-between text-sm">
                                  <span>
                                    {sub.name}
                                    {valueDisplay}:
                                  </span>
                                  <span
                                    className={
                                      price > 0
                                        ? "font-medium text-blue-600"
                                        : "font-medium"
                                    }
                                  >
                                    {price > 0
                                      ? `+${formatCurrency(price)}`
                                      : "Included"}
                                  </span>
                                </div>

                                {/* Display discount information if applicable */}
                                {discount.applied && (
                                  <div className="flex justify-between text-sm text-green-600 pl-4">
                                    <span>
                                      Volume discount ({discount.percentage}):
                                    </span>
                                    <span>
                                      -{formatCurrency(discount.amount)}
                                    </span>
                                  </div>
                                )}
                              </React.Fragment>
                            );
                          })}

                          <div className="flex justify-between mt-2 pt-2 border-t">
                            <span className="font-semibold">Total:</span>
                            <span className="font-bold text-base">
                              {formatCurrency(componentPrice)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>

            <div className="pricing-summary border-t pt-3 mb-4">
              <div className="flex justify-between text-lg mb-1">
                <span>Subtotal:</span>
                <span className="font-medium">
                  {formatCurrency(calculateSubtotal())}
                </span>
              </div>

              <div className="flex justify-between text-lg mb-1">
                <span>Contingency:</span>
                <span className="font-medium">
                  {formatCurrency(calculateContingency())}
                </span>
              </div>

              <div className="flex justify-between text-xl font-bold border-t pt-3 mt-1">
                <span>Total:</span>
                <span>{formatCurrency(calculateTotal())}</span>
              </div>
            </div>
          </div>
        </div>

        <div
          className="bg-gray-100 px-6 py-4 flex justify-end space-x-4 border-t"
          style={{ position: "sticky", bottom: 0, zIndex: 10 }}
        >
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
