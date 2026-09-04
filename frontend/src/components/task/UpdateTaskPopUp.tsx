"use client";

import { useEffect, useState } from "react";

import { sendGetRequest } from "@/apis/getRequest";
import { callApis } from "@/apis/callApi";
import type { Task } from "@/types/allTypes";

type UpdateTaskPopUpProps = {
  taskId: string;
  onClose: () => void;
  onUpdated?: () => void;
};

type Member = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: "ADMIN" | "MEMBER";
};

type WorkflowState = {
  id: string;
  name: string;
  position: number;
};

type TaskDetails = Task & {
  boardId: string;
  workflowState: WorkflowState;
  createdAt: string;
  updatedAt: string;
};

type Board = {
  id: string;
  members: {
    user: Member;
  }[];
  states: WorkflowState[];
};

export default function UpdateTaskPopUp({
  taskId,
  onClose,
  onUpdated,
}: UpdateTaskPopUpProps) {
  const [task, setTask] = useState<TaskDetails | null>(null);
  const [board, setBoard] = useState<Board | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [workflowStateId, setWorkflowStateId] = useState("");
  const [priorityIndex, setPriorityIndex] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [finishDate, setFinishDate] = useState("");
  const [assigneeIds, setAssigneeIds] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchTaskAndBoard() {
      try {
        const taskData = await sendGetRequest(
          `/tasks/${taskId}`,
          "UpdateTaskPopUp",
          {
            requiredAuth: true,
          },
        );

        if (cancelled) {
          return;
        }

        setTask(taskData);

        setTitle(taskData.title);
        setDescription(taskData.description ?? "");
        setWorkflowStateId(taskData.workflowStateId);
        setPriorityIndex(taskData.priorityIndex);

        setStartDate(
          taskData.startDate
            ? taskData.startDate.slice(0, 10)
            : "",
        );

        setFinishDate(
          taskData.finishDate
            ? taskData.finishDate.slice(0, 10)
            : "",
        );

        setAssigneeIds(
          taskData.assignees?.map(
            (assignee: { user: Member }) => assignee.user.id,
          ) ?? [],
        );

        const boardData = await sendGetRequest(
          `/boards/${taskData.boardId}`,
          "UpdateTaskPopUp",
          {
            requiredAuth: true,
          },
        );

        if (!cancelled) {
          setBoard(boardData);
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchTaskAndBoard();

    return () => {
      cancelled = true;
    };
  }, [taskId]);

  const handleAssigneeChange = (userId: string) => {
    setAssigneeIds((currentIds) => {
      if (currentIds.includes(userId)) {
        return currentIds.filter((id) => id !== userId);
      }

      return [...currentIds, userId];
    });
  };

  const handleSubmit = async (
    event: React.SyntheticEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    try {
      setUpdating(true);

      const body = {
        title: title.trim(),
        description: description.trim() || undefined,
        workflowStateId,
        priorityIndex,
        assigneeIds,
        startDate: startDate
          ? new Date(startDate).toISOString()
          : undefined,
        finishDate: finishDate
          ? new Date(finishDate).toISOString()
          : undefined,
      };

      const updatedTask = await callApis(
        `/tasks/${taskId}`,
        "UpdateTaskPopUp",
        {
          method: "PATCH",
          body,
          requiredAuth: true,
        },
      );

      setTask(updatedTask);

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
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl">

        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            Update Task
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
                rows={4}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-gray-900"
              />
            </div>

            {/* Workflow State */}
            <div>
              <label
                htmlFor="task-state"
                className="block text-sm font-medium text-gray-700"
              >
                Workflow State
              </label>

              <select
                id="task-state"
                value={workflowStateId}
                onChange={(event) =>
                  setWorkflowStateId(event.target.value)
                }
                required
                className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none focus:border-gray-900"
              >
                {board?.states
                  .sort((a, b) => a.position - b.position)
                  .map((state) => (
                    <option
                      key={state.id}
                      value={state.id}
                    >
                      {state.name}
                    </option>
                  ))}
              </select>
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

            {/* Start Date */}
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

            {/* Finish Date */}
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

            {/* Assigned Members */}
            <div>
              <p className="block text-sm font-medium text-gray-700">
                Assigned Members
              </p>

              {!board ? (
                <p className="mt-2 text-sm text-gray-500">
                  Loading members...
                </p>
              ) : board.members.length === 0 ? (
                <p className="mt-2 text-sm text-gray-500">
                  No members available.
                </p>
              ) : (
                <div className="mt-2 max-h-48 space-y-2 overflow-y-auto rounded-lg border border-gray-300 p-3">
                  {board.members.map((member) => {
                    const user = member.user;
                    const selected =
                      assigneeIds.includes(user.id);

                    return (
                      <label
                        key={user.id}
                        className="flex cursor-pointer items-center gap-3 rounded-lg p-2 hover:bg-gray-50"
                      >
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() =>
                            handleAssigneeChange(user.id)
                          }
                          className="h-4 w-4"
                        />

                        <div>
                          <p className="font-medium text-gray-900">
                            {user.name}
                          </p>

                          <p className="text-sm text-gray-500">
                            {user.email}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}

              <p className="mt-2 text-xs text-gray-500">
                Select one or more board members to assign.
              </p>
            </div>

            {/* Buttons */}
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
                {updating
                  ? "Updating..."
                  : "Update Task"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
