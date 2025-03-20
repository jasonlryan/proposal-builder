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
    calculateComponentPrice,
    calculateSubtotal,
    calculateContingency,
    calculateTotal,
    formatCurrency,
    getContingencyRate,
  } = usePricing();

  const subtotal = calculateSubtotal();
  const contingency = calculateContingency();
  const total = calculateTotal();

  // Calculate total Power Hour discounts
  const calculatePowerHourDiscounts = () => {
    let totalDiscount = 0;

    // Find Power Hour components
    const powerHourComponents = selectedComponents.filter(
      (component) => component.baseId === "powerHour"
    );

    // Calculate discounts for each Power Hour component
    powerHourComponents.forEach((component) => {
      const hoursElement = component.subElements.find(
        (sub) => sub.id === "hours"
      );

      if (hoursElement?.hasVolumeDiscount && hoursElement.value) {
        const hours = hoursElement.value || 0;
        const fullPrice = hoursElement.priceImpact * hours;

        // Get the actual price with discount applied
        const subElements = component.subElements.filter(
          (s) => s.id !== "hours"
        );
        let actualComponentPrice = component.basePrice;

        // Add other sub-element prices
        subElements.forEach((sub) => {
          if (sub.type === "boolean" && sub.value && sub.priceImpact) {
            actualComponentPrice += sub.priceImpact;
          } else if (sub.type === "quantity" && sub.value && sub.priceImpact) {
            actualComponentPrice += sub.priceImpact * sub.value;
          } else if (sub.type === "selection" && sub.value && sub.priceImpact) {
            if (typeof sub.value === "number" && sub.value > 0) {
              actualComponentPrice += sub.priceImpact * sub.value;
            } else {
              actualComponentPrice += sub.priceImpact;
            }
          }
        });

        // Calculate hours price with discount
        let hoursPriceWithDiscount = hoursElement.priceImpact * hours;
        if (hours >= 10) {
          // 10% discount
          hoursPriceWithDiscount *= 0.9;
        } else if (hours >= 5) {
          // 5% discount
          hoursPriceWithDiscount *= 0.95;
        }

        // Add hours price with discount
        actualComponentPrice += hoursPriceWithDiscount;

        // Calculate total component price without discount
        const fullComponentPrice = component.basePrice + fullPrice;

        // Calculate discount
        const discount = fullComponentPrice - actualComponentPrice;
        totalDiscount += discount;
      }
    });

    return totalDiscount;
  };

  const powerHourDiscount = calculatePowerHourDiscounts();
  const hasPowerHourDiscount = powerHourDiscount > 0;

  return (
    <div className="preview-panel">
      <div className="panel-header">
        <h3>Proposal Summary</h3>
      </div>
      <div className="summary-content p-4">
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
                .map((component) => {
                  const price = calculateComponentPrice(component);
                  const isPowerHour = component.baseId === "powerHour";

                  // Calculate full price before discount for Power Hour
                  let displayPrice = price;

                  if (isPowerHour) {
                    const hoursElement = component.subElements.find(
                      (sub) => sub.id === "hours"
                    );

                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    if (hoursElement?.hasVolumeDiscount && hoursElement.value) {
                      const hours = hoursElement.value || 0;
                      const hourlyRate = hoursElement.priceImpact;

                      // Calculate the discount amount
                      let discountPercentage = 0;
                      if (hours >= 10) {
                        discountPercentage = 0.1; // 10%
                      } else if (hours >= 5) {
                        discountPercentage = 0.05; // 5%
                      }

                      if (discountPercentage > 0) {
                        // Add back the discount to get the full price
                        const hoursCost = hourlyRate * hours;
                        const hoursDiscount = hoursCost * discountPercentage;
                        displayPrice = price + hoursDiscount;
                      }
                    }
                  }

                  return (
                    <li
                      key={component.instanceId}
                      className="flex justify-between mb-1"
                    >
                      <span>{component.name}</span>
                      <span>{formatCurrency(displayPrice)}</span>
                    </li>
                  );
                })}
            </ul>
          )}
        </div>

        <div className="pricing-summary space-y-2 border-t pt-4">
          {hasPowerHourDiscount && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Power Hour volume discount:</span>
              <span>-{formatCurrency(powerHourDiscount)}</span>
            </div>
          )}

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
