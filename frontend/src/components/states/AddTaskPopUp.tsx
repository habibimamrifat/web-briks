"use client";

import { useState } from "react";
import { callApis } from "@/apis/callApi";
import { Task } from "@/types/allTypes";

type AddTaskPopupProps = {
  boardId: string;
  workflowStateId: string;
  onClose: () => void;
  onCreated?: (task: Task) => void;
};

export default function AddTaskPopup({
  boardId,
  workflowStateId,
  onClose,
  onCreated,
}: AddTaskPopupProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priorityIndex, setPriorityIndex] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [finishDate, setFinishDate] = useState("");

  const [creating, setCreating] = useState(false);

  const handleSubmit = async (
    event: React.SyntheticEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    try {
      setCreating(true);

      const body = {
        title: title.trim(),
        description: description.trim() || undefined,
        boardId,
        workflowStateId,
        priorityIndex,
        startDate: startDate
          ? new Date(startDate).toISOString()
          : undefined,
        finishDate: finishDate
          ? new Date(finishDate).toISOString()
          : undefined,
      };

const createdTask = await callApis(
  "/tasks",
  "AddTaskPopup",
  {
    method: "POST",
    body,
    requiredAuth: true,
  },
);

onCreated?.(createdTask);
onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-xl rounded-xl bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            Add Task
          </h2>

          <button
            type="button"
            onClick={onClose}
            disabled={creating}
            className="text-xl text-gray-500 hover:text-gray-900 disabled:opacity-50"
          >
            ×
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-5"
        >
          {/* Title */}
          <div>
            <label
              htmlFor="task-title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>

            <input
              id="task-title"
              type="text"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              placeholder="Enter task title"
              required
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-gray-900"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="task-description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>

            <textarea
              id="task-description"
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              placeholder="Enter task description"
              rows={4}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-gray-900"
            />
          </div>

          {/* Position */}
          <div>
            <label
              htmlFor="task-position"
              className="block text-sm font-medium text-gray-700"
            >
              Position
            </label>

            <input
              id="task-position"
              type="number"
              min="0"
              value={priorityIndex}
              onChange={(event) =>
                setPriorityIndex(
                  Number(event.target.value),
                )
              }
              required
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-gray-900"
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="task-start-date"
                className="block text-sm font-medium text-gray-700"
              >
                Start Date
              </label>

              <input
                id="task-start-date"
                type="date"
                value={startDate}
                onChange={(event) =>
                  setStartDate(event.target.value)
                }
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-gray-900"
              />
            </div>

            <div>
              <label
                htmlFor="task-finish-date"
                className="block text-sm font-medium text-gray-700"
              >
                Finish Date
              </label>

              <input
                id="task-finish-date"
                type="date"
                value={finishDate}
                onChange={(event) =>
                  setFinishDate(event.target.value)
                }
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-gray-900"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 border-t border-gray-200 pt-5">
            <button
              type="button"
              onClick={onClose}
              disabled={creating}
              className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={creating}
              className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {creating ? "Creating..." : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

