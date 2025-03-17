"use client";

import React, { useState } from "react";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { toast } from "react-toastify";

const AddRoomType = ({ onAddSuccess, id }: any) => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    pricePerNight: "",
    maxGuests: "",
    bedrooms: "",
    bathrooms: "",
  });

  const toggleModal = () => {
    if (!loading) {
      setShowModal(!showModal);
    }
  };

  const handleSubmit = async () => {
    // Validate the name field
    if (!formData.name.trim()) {
      toast.error("Room name is required.");
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
        listingId: id,
      };

      const response = await axios.post("/api/listings/addRoom", processedData);

      if (response.status === 200) {
        const newRoomType = response.data.data;
        toast.success("Room type added successfully!");

        // Call onAddSuccess to update the parent state
        onAddSuccess(newRoomType);

        setShowModal(false);
      } else {
        toast.error(response.data.message || "Failed to add room type.");
      }
    } catch (error) {
      console.error("Error adding room type:", error);
      toast.error("An error occurred while adding the room type.");
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
        <PlusCircleIcon className="h-9 w-9 text-blue-600" />
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Add Room Type</h3>
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
                    className="px-4 py-2 bg-green-500 text-white rounded-lg"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? "Submitting..." : "Submit"}
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

export default AddRoomType;
