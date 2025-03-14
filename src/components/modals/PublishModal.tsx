import React from "react";

interface PublishModalProps {
  url: string;
  onUrlChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPublish: () => void;
  onClose: () => void;
}

const PublishModal: React.FC<PublishModalProps> = ({
  url,
  onUrlChange,
  onPublish,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div className="bg-green-600 text-white px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Publish Proposal</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-green-200 transition-colors"
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

        <div className="p-6">
          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              Enter the URL where you want to publish this proposal. The
              proposal will be accessible to anyone with the link.
            </p>

            <div className="mt-4">
              <label
                htmlFor="publish-url"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Publish URL
              </label>
              <input
                type="text"
                id="publish-url"
                value={url}
                onChange={onUrlChange}
                placeholder="https://example.com/proposals/my-proposal"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded transition-colors"
            >
              Cancel
            </button>

            <button
              onClick={onPublish}
              className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition-colors"
              disabled={!url.trim()}
            >
              Publish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublishModal;
