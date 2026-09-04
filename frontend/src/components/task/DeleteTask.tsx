"use client";

import { useState } from "react";

import { callApis } from "@/apis/callApi";

type DeleteTaskProps = {
  taskId: string;
  onDeleted: (taskId: string) => void;
};

export default function DeleteTask({
  taskId,
  onDeleted,
}: DeleteTaskProps) {
  const [showPopup, setShowPopup] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setDeleting(true);

      await callApis(
        `/tasks/${taskId}`,
        "DeleteTask",
        {
          method: "DELETE",
          requiredAuth: true,
        },
      );

      setShowPopup(false);
      onDeleted(taskId);
    } catch (error) {
      console.error(error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      {/* Delete Button */}
      <button
        type="button"
        onClick={() => setShowPopup(true)}
        className="rounded-md border border-red-300 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
      >
        Delete
      </button>

      {/* Confirmation Popup */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-bold text-gray-900">
              Delete Task
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              Are you sure you want to delete this task?
              This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowPopup(false)}
                disabled={deleting}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

