"use client";

import { useEffect, useState } from "react";

import { sendGetRequest } from "@/apis/getRequest";

type ViewStatePopUpProps = {
  stateId: string;
  onClose: () => void;
};

type WorkflowState = {
  id: string;
  name: string;
  description: string | null;
  position: number;
  startDate: string | null;
  finishDate: string | null;
  createdAt: string;
  updatedAt: string;
};

export default function ViewStatePopUp({
  stateId,
  onClose,
}: ViewStatePopUpProps) {
  const [state, setState] = useState<WorkflowState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchState() {
      try {
        const data = await sendGetRequest(
          `/workflow-states/${stateId}`,
          "ViewStatePopUp",
          {
            requiredAuth: true,
          },
        );

        if (!cancelled) {
          setState(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchState();

    return () => {
      cancelled = true;
    };
  }, [stateId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            Workflow State Details
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-xl text-gray-500 hover:text-gray-900"
          >
            ×
          </button>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="py-10 text-center text-gray-600">
            Loading state...
          </div>
        ) : !state ? (
          <div className="py-10 text-center text-gray-600">
            State not found.
          </div>
        ) : (
          <div className="mt-6 space-y-6">

            {/* Name */}
            <div>
              <p className="text-sm font-medium text-gray-500">
                Name
              </p>

              <p className="mt-1 text-lg font-semibold text-gray-900">
                {state.name}
              </p>
            </div>

            {/* Description */}
            <div>
              <p className="text-sm font-medium text-gray-500">
                Description
              </p>

              <p className="mt-1 text-gray-700">
                {state.description || "No description provided."}
              </p>
            </div>

            {/* Position */}
            <div>
              <p className="text-sm font-medium text-gray-500">
                Position
              </p>

              <p className="mt-1 text-gray-900">
                {state.position}
              </p>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Start Date
                </p>

                <p className="mt-1 text-gray-900">
                  {state.startDate
                    ? new Date(
                        state.startDate,
                      ).toLocaleDateString()
                    : "Not set"}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">
                  Finish Date
                </p>

                <p className="mt-1 text-gray-900">
                  {state.finishDate
                    ? new Date(
                        state.finishDate,
                      ).toLocaleDateString()
                    : "Not set"}
                </p>
              </div>
            </div>

            {/* Created / Updated */}
            <div className="grid grid-cols-1 gap-4 border-t border-gray-200 pt-5 sm:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Created At
                </p>

                <p className="mt-1 text-gray-900">
                  {new Date(
                    state.createdAt,
                  ).toLocaleString()}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">
                  Updated At
                </p>

                <p className="mt-1 text-gray-900">
                  {new Date(
                    state.updatedAt,
                  ).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Close */}
            <div className="flex justify-end border-t border-gray-200 pt-5">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
              >
                Close
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

