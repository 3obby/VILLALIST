"use client";

import React, { useState } from "react";
import { TrashIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { toast } from "react-toastify";

const DeleteRoomType = ({ roomTypeId, onDeleteSuccess }) => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleModal = () => {
    if (!loading) {
      setShowModal(!showModal);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      // Send DELETE request to API
      const response = await axios.delete(
        `/api/listings/deleteRoom?id=${roomTypeId}`
      );

      if (response.status === 200) {
        toast.success("Room type deleted successfully!");
        // Call onDeleteSuccess to update the UI
        if (onDeleteSuccess) {
          onDeleteSuccess(roomTypeId);
        }
        setShowModal(false);
      } else {
        toast.error(response.data.message || "Failed to delete room type.");
      }
    } catch (error) {
      console.error("Error deleting room type:", error);
      toast.error("An error occurred while deleting the room type.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={toggleModal}
      >
        <TrashIcon className="h-5 w-5 text-red-600" />
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Confirm Delete</h3>
              <button onClick={toggleModal} className="text-gray-500">
                ✖
              </button>
            </div>
            <div>
              <p className="mt-4">
                Are you sure you want to delete this room type?
              </p>
              <div className="flex justify-between mt-4">
                <button
                  className="px-4 py-2 bg-gray-300 rounded-lg"
                  onClick={toggleModal}
                >
                  Cancel
                </button>
                <button
                  className={`px-4 py-2 ${
                    loading ? "bg-gray-500" : "bg-red-500"
                  } text-white rounded-lg hover:${
                    loading ? "bg-gray-600" : "bg-red-600"
                  }`}
                  onClick={handleDelete}
                  disabled={loading}
                >
                  {loading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteRoomType;
