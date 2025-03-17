import React, { useState } from "react";
import axios from "axios";
import { PencilSquareIcon } from "@heroicons/react/24/solid";

interface ReusableModalProps {
  title: string;
  previousData: { [key: string]: any };
  apiUrl: string;
  onSuccess: (updatedData: any) => void;
  isArea?: boolean; // New prop to specify if textarea is required
}

const ReusableModal: React.FC<ReusableModalProps> = ({
  title,
  previousData,
  apiUrl,
  onSuccess,
  isArea = false, // Default to false
}) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(previousData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (key: string, value: any) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(apiUrl, { ...formData, id: previousData.id });
      if (response.data.success) {
        onSuccess(response.data.data);
        setShowModal(false);
      } else {
        setError(response.data.message || "Failed to update.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while updating.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setShowModal(true)}
      >
         <PencilSquareIcon className="h-5 w-5 md:h-7 md:w-7 text-blue-600" />
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
            {/* Title */}
            <h2 className="text-lg font-semibold text-gray-800">{title}</h2>

            {/* Form */}
            <div className="mt-4 space-y-4">
              {Object.keys(previousData).map((key) =>
                key === "id" ? null : (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 capitalize">
                      {key.replace(/([A-Z])/g, " $1")}
                    </label>
                    {isArea ? (
                      <textarea
                        value={formData[key] || ""}
                        onChange={(e) => handleInputChange(key, e.target.value)}
                        className="w-full mt-1 px-3 py-2 border rounded-lg shadow-sm focus:ring focus:ring-blue-200 focus:outline-none"
                        rows={5} // Default number of rows for textarea
                      ></textarea>
                    ) : (
                      <input
                        type="text"
                        value={formData[key] || ""}
                        onChange={(e) => handleInputChange(key, e.target.value)}
                        className="w-full mt-1 px-3 py-2 border rounded-lg shadow-sm focus:ring focus:ring-blue-200 focus:outline-none"
                      />
                    )}
                  </div>
                )
              )}
            </div>

            {/* Error Message */}
            {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

            {/* Actions */}
            <div className="mt-6 flex justify-end space-x-3">
              <button
                className="px-4 py-2 bg-gray-200 rounded-lg shadow hover:bg-gray-300"
                onClick={() => setShowModal(false)}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Loading..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReusableModal;
