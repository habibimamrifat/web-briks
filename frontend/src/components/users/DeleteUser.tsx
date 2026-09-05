"use client";

import { useState } from "react";
import { callApis } from "@/apis/callApi";

type DeleteUserProps = {
  userId: string;
  onDeleted: (userId: string) => void;
};

export default function DeleteUser({
  userId,
  onDeleted,
}: DeleteUserProps) {
  const [showModal, setShowModal] =
    useState(false);

  const [deleting, setDeleting] =
    useState(false);

  const handleDelete = async () => {
    try {
      setDeleting(true);

      await callApis(
        `/users/${userId}`,
        "DeleteUserComponent",
        {
          method: "DELETE",
          requiredAuth: true,
        },
      );

      onDeleted(userId);
      setShowModal(false);
    } catch (error) {
      console.error(error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setShowModal(true)}
        className="rounded-lg border border-red-300 bg-white px-3 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-50"
      >
        Delete
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-xl font-bold text-gray-900">
              Delete User
            </h2>

            <p className="mt-3 text-gray-600">
              Are you sure you want to permanently
              delete this user?
            </p>

            <p className="mt-2 text-sm font-medium text-red-600">
              Once deleted, this user cannot be
              registered again using the same email
              address.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() =>
                  setShowModal(false)
                }
                disabled={deleting}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleting
                  ? "Deleting..."
                  : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}