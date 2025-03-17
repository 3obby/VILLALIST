"use client";

import React, { useState } from "react";
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { toast } from "react-toastify";

interface EditListingProps {
  listingData: any;
  onEditSuccess: (updatedData: any) => void; // Callback to refresh data after edit
}

const EditListing: React.FC<EditListingProps> = ({
  listingData,
  onEditSuccess,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [pageIndex, setPageIndex] = useState(0); // Tracks current page in pagination
  const [loading, setLoading] = useState(false); // Loading state for API call

  const [editData, setEditData] = useState({
    title: listingData?.title || "",
    description: listingData?.description || "",
    address: listingData?.address || "",
    pricePerNight: listingData?.pricePerNight || 0,
    maxGuests: listingData?.maxGuests || 0,
    bedrooms: listingData?.bedrooms || 0,
    bathrooms: listingData?.bathrooms || 0,
  });

  const toggleModal = () => {
    if (!loading) {
      setShowModal(!showModal);
    }
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setEditData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmitEdit = async () => {
    setLoading(true); // Start loading

    // Determine which fields have changed
    const changedFields = Object.keys(editData).reduce((acc, key) => {
      if (editData[key] !== listingData[key]) {
        acc[key] = editData[key];
      }
      return acc;
    }, {});

    // If no fields have changed, do nothing
    if (Object.keys(changedFields).length === 0) {
      toast.info("No changes detected.", { position: "top-center" });
      setLoading(false);
      return;
    }

    try {
      const response = await axios.put(`/api/listings/updateListing`, {
        id: listingData.id,
        ...changedFields, // Only send the changed fields
      });

      if (response.data.success) {
        toast.success("Listing updated successfully!", {
          position: "top-center",
        });

        // Update the parent component with the new data
        onEditSuccess({ ...listingData, ...changedFields });

        toggleModal(); // Close the modal
      } else {
        toast.error(response.data.message, { position: "top-center" });
      }
    } catch (error) {
      toast.error("Failed to update listing. Please try again.", {
        position: "top-center",
      });
    } finally {
      setLoading(false); // Stop loading
      setPageIndex(0);
    }
  };

  const renderPageContent = () => {
    switch (pageIndex) {
      case 0:
        return (
          <>
            <div>
              <label className="block text-sm font-medium">Title</label>
              <input
                type="text"
                name="title"
                value={editData.title}
                onChange={handleEditChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Description</label>
              <textarea
                name="description"
                value={editData.description}
                onChange={handleEditChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          </>
        );
      case 1:
        return (
          <>
            <div>
              <label className="block text-sm font-medium">Address</label>
              <input
                type="text"
                name="address"
                value={editData.address}
                onChange={handleEditChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">
                Price per Night
              </label>
              <input
                type="number"
                name="pricePerNight"
                value={editData.pricePerNight}
                onChange={handleEditChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          </>
        );
      case 2:
        return (
          <>
            <div>
              <label className="block text-sm font-medium">Max Guests</label>
              <input
                type="number"
                name="maxGuests"
                value={editData.maxGuests}
                onChange={handleEditChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Bedrooms</label>
              <input
                type="number"
                name="bedrooms"
                value={editData.bedrooms}
                onChange={handleEditChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          </>
        );
      case 3:
        return (
          <>
            <div>
              <label className="block text-sm font-medium">Bathrooms</label>
              <input
                type="number"
                name="bathrooms"
                value={editData.bathrooms}
                onChange={handleEditChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* Edit Icon */}
      <div
        className="fixed top-4 right-4 md:top-6 md:right-6 z-50 cursor-pointer bg-white dark:bg-neutral-900 shadow-lg p-2 md:p-3 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-neutral-800 transition"
        onClick={toggleModal}
      >
        <PencilSquareIcon className="h-5 w-5 md:h-7 md:w-7 text-blue-600" />
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium">Edit Listing</h2>
              <button
                onClick={toggleModal}
                className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-300"
              >
                ✖
              </button>
            </div>
            <div className="space-y-4 mt-4">
              {/* Render paginated content */}
              {renderPageContent()}

              {/* Pagination Controls */}
              <div className="flex justify-between items-center mt-4">
                <button
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                  onClick={() => setPageIndex((prev) => Math.max(0, prev - 1))}
                  disabled={pageIndex === 0}
                >
                  Previous
                </button>
                {pageIndex < 4 ? (
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    onClick={() => setPageIndex((prev) => prev + 1)}
                  >
                    Next
                  </button>
                ) : (
                  <button
                    className={`px-4 py-2 ${
                      loading ? "bg-gray-500" : "bg-green-500"
                    } text-white rounded-lg hover:${
                      loading ? "bg-gray-600" : "bg-green-600"
                    }`}
                    onClick={handleSubmitEdit}
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditListing;
