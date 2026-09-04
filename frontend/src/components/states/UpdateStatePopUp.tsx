"use client";

import { useEffect, useState } from "react";

import { sendGetRequest } from "@/apis/getRequest";
import { callApis } from "@/apis/callApi";

type UpdateStatePopUpProps = {
  stateId: string;
  onClose: () => void;
  onUpdated?: () => void;
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

export default function UpdateStatePopUp({
  stateId,
  onClose,
  onUpdated,
}: UpdateStatePopUpProps) {
  const [state, setState] = useState<WorkflowState | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [position, setPosition] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [finishDate, setFinishDate] = useState("");

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchState() {
      try {
        const data = await sendGetRequest(
          `/workflow-states/${stateId}`,
          "UpdateStatePopUp",
          {
            requiredAuth: true,
          },
        );

        if (!cancelled) {
          setState(data);
          setName(data.name);
          setDescription(data.description ?? "");
          setPosition(data.position);
          setStartDate(
            data.startDate ? data.startDate.slice(0, 10) : "",
          );
          setFinishDate(
            data.finishDate ? data.finishDate.slice(0, 10) : "",
          );
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

  const handleSubmit = async (
    event: React.SyntheticEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    try {
      setUpdating(true);

      const body = {
        name: name.trim(),
        description: description.trim() || undefined,
        position,
        startDate: startDate
          ? new Date(startDate).toISOString()
          : undefined,
        finishDate: finishDate
          ? new Date(finishDate).toISOString()
          : undefined,
      };

      const updatedState = await callApis(
        `/workflow-states/${stateId}`,
        "UpdateStatePopUp",
        {
          method: "PATCH",
          body,
          requiredAuth: true,
        },
      );

      setState(updatedState);

      onUpdated?.();
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-xl rounded-xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            Update Workflow State
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-xl text-gray-500 hover:text-gray-900"
          >
            ×
          </button>
        </div>

        {loading ? (
          <div className="py-10 text-center text-gray-600">
            Loading state...
          </div>
        ) : !state ? (
          <div className="py-10 text-center text-gray-600">
            State not found.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            {/* Name */}
            <div>
              <label
                htmlFor="state-name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>

              <input
                id="state-name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-gray-900"
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="state-description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>

              <textarea
                id="state-description"
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                rows={4}
                placeholder="Enter state description"
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-gray-900"
              />
            </div>

            {/* Position */}
            <div>
              <label
                htmlFor="state-position"
                className="block text-sm font-medium text-gray-700"
              >
                Position
              </label>

              <input
                id="state-position"
                type="number"
                min="0"
                value={position}
                onChange={(event) =>
                  setPosition(Number(event.target.value))
                }
                required
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-gray-900"
              />
            </div>

            {/* Start Date */}
            <div>
              <label
                htmlFor="state-start-date"
                className="block text-sm font-medium text-gray-700"
              >
                Start Date
              </label>

              <input
                id="state-start-date"
                type="date"
                value={startDate}
                onChange={(event) =>
                  setStartDate(event.target.value)
                }
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-gray-900"
              />
            </div>

            {/* Finish Date */}
            <div>
              <label
                htmlFor="state-finish-date"
                className="block text-sm font-medium text-gray-700"
              >
                Finish Date
              </label>

              <input
                id="state-finish-date"
                type="date"
                value={finishDate}
                onChange={(event) =>
                  setFinishDate(event.target.value)
                }
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-gray-900"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 border-t border-gray-200 pt-5">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={updating}
                className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {updating ? "Updating..." : "Update State"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}