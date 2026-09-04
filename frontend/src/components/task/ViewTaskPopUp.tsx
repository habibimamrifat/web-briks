"use client";

import { useEffect, useState } from "react";

import { sendGetRequest } from "@/apis/getRequest";
import { Task } from "@/types/allTypes";

type ViewTaskPopUpProps = {
  taskId: string;
  onClose: () => void;
};

type WorkflowState = {
  id: string;
  name: string;
};

type TaskDetails = Task & {
  workflowState: WorkflowState;
  createdAt: string;
  updatedAt: string;
};

export default function ViewTaskPopUp({
  taskId,
  onClose,
}: ViewTaskPopUpProps) {
  const [task, setTask] = useState<TaskDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchTask() {
      try {
        const data = await sendGetRequest(
          `/tasks/${taskId}`,
          "ViewTaskPopUp",
          {
            requiredAuth: true,
          },
        );

        if (!cancelled) {
          setTask(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchTask();

    return () => {
      cancelled = true;
    };
  }, [taskId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            Task Details
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
            Loading task...
          </div>
        ) : !task ? (
          <div className="py-10 text-center text-gray-600">
            Task not found.
          </div>
        ) : (
          <div className="mt-6 space-y-6">
            {/* Title */}
            <div>
              <p className="text-sm font-medium text-gray-500">
                Title
              </p>

              <p className="mt-1 text-lg font-semibold text-gray-900">
                {task.title}
              </p>
            </div>

            {/* Description */}
            <div>
              <p className="text-sm font-medium text-gray-500">
                Description
              </p>

              <p className="mt-1 text-gray-700">
                {task.description || "No description provided."}
              </p>
            </div>

            {/* Workflow State + Position */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Workflow State
                </p>

                <p className="mt-1 text-gray-900">
                  {task.workflowState.name}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">
                  Position
                </p>

                <p className="mt-1 text-gray-900">
                  {task.priorityIndex}
                </p>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Start Date
                </p>

                <p className="mt-1 text-gray-900">
                  {task.startDate
                    ? new Date(
                        task.startDate,
                      ).toLocaleString()
                    : "Not set"}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">
                  Finish Date
                </p>

                <p className="mt-1 text-gray-900">
                  {task.finishDate
                    ? new Date(
                        task.finishDate,
                      ).toLocaleString()
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
                    task.createdAt,
                  ).toLocaleString()}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">
                  Updated At
                </p>

                <p className="mt-1 text-gray-900">
                  {new Date(
                    task.updatedAt,
                  ).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Assigned Members */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Assigned Members
              </h3>

              {task.assignees.length === 0 ? (
                <p className="mt-2 text-sm text-gray-500">
                  No members assigned.
                </p>
              ) : (
                <div className="mt-3 space-y-3">
                  {task.assignees.map((assignee) => (
                    <div
                      key={assignee.id}
                      className="rounded-lg border border-gray-200 p-3"
                    >
                      <p className="font-semibold text-gray-900">
                        {assignee.user.name}
                      </p>

                      <p className="text-sm text-gray-600">
                        {assignee.user.email}
                      </p>

                      <p className="text-xs text-gray-500">
                        {assignee.user.role}
                      </p>
                    </div>
                  ))}
                </div>
              )}
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