"use client";

import React, { useState } from "react";
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { toast } from "react-toastify";

const EditRoomType = ({ roomType, onEditSuccess }: any) => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);

  const [formData, setFormData] = useState({
    name: roomType.name || "",
    pricePerNight: roomType.pricePerNight || 0,
    maxGuests: roomType.maxGuests || 0,
    bedrooms: roomType.bedrooms || 0,
    bathrooms: roomType.bathrooms || 0,
  });

  const toggleModal = () => {
    if (!loading) {
      setShowModal(!showModal);
    }
  };

  const handleSubmit = async () => {
    // Validate that name is provided
    if (!formData.name.trim()) {
      toast.error("Room type name is required.");
      return;
    }

    // Check for changes
    const hasChanges = Object.keys(formData).some(
      (key) => formData[key] !== roomType[key]
    );

    if (!hasChanges) {
      toast.info("No changes detected.");
      return;
    }

    setLoading(true);
    try {
      // Ensure numeric fields have default values of 0 if not provided
      const processedData = {
        ...formData,
        pricePerNight: parseFloat(formData.pricePerNight) || 0,
        maxGuests: parseInt(formData.maxGuests, 10) || 0,
        bedrooms: parseInt(formData.bedrooms, 10) || 0,
        bathrooms: parseInt(formData.bathrooms, 10) || 0,
      };

      // Send PUT request to API
      const response = await axios.put("/api/listings/updateRoom", {
        id: roomType.id,
        ...processedData,
      });

      if (response.status === 200) {
        toast.success("Room type updated successfully!");
        const updatedRoomType = response.data.data;

        // Call onEditSuccess to update the parent state
        if (onEditSuccess) {
          onEditSuccess(updatedRoomType);
        }

        setShowModal(false);
      } else {
        toast.error(response.data.message || "Failed to update room type.");
      }
    } catch (error) {
      console.error("Error updating room type:", error);
      toast.error("An error occurred while updating the room type.");
    } finally {
      setLoading(false);
      setPageIndex(0);
    }
  };

  const renderFormPage = () => {
    switch (pageIndex) {
      case 0:
        return (
          <div>
            <label>Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg"
            />
            <label>Price Per Night</label>
            <input
              type="number"
              value={formData.pricePerNight}
              onChange={(e) =>
                setFormData({ ...formData, pricePerNight: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
        );
      case 1:
        return (
          <div>
            <label>Max Guests</label>
            <input
              type="number"
              value={formData.maxGuests}
              onChange={(e) =>
                setFormData({ ...formData, maxGuests: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg"
            />
            <label>Bedrooms</label>
            <input
              type="number"
              value={formData.bedrooms}
              onChange={(e) =>
                setFormData({ ...formData, bedrooms: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
        );
      case 2:
        return (
          <div>
            <label>Bathrooms</label>
            <input
              type="number"
              value={formData.bathrooms}
              onChange={(e) =>
                setFormData({ ...formData, bathrooms: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <button
        onClick={toggleModal}
      >
        <PencilSquareIcon className="h-5 w-5 text-gray-600" />
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Edit Room Type</h3>
              <button onClick={toggleModal} className="text-gray-500">
                ✖
              </button>
            </div>

            <div>
              {renderFormPage()}
              <div className="flex justify-between mt-4">
                {pageIndex > 0 && (
                  <button
                    className="px-4 py-2 bg-gray-300 rounded-lg"
                    onClick={() => setPageIndex((prev) => prev - 1)}
                  >
                    Previous
                  </button>
                )}
                {pageIndex < 2 ? (
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg"
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
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? "Updating..." : "Update"}
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

export default EditRoomType;
