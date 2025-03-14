import React from "react";

interface ConfirmationModalProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  title,
  message,
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div className="bg-yellow-500 text-white px-6 py-4">
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <p className="text-gray-600">{message}</p>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onCancel}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded transition-colors"
            >
              Cancel
            </button>

            <button
              onClick={onConfirm}
              className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded transition-colors"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
