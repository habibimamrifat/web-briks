"use client";

import type { Task } from "@/types/allTypes";

import ViewTask from "../task/ViewTask";
import DeleteTask from "../task/DeleteTask";
import UpdateTask from "../task/UpdateTask";

type EachTaskProps = {
  task: Task;
  onDelete: (taskId: string) => void;
};

export default function EachTask({
  task,
  onDelete,
}: EachTaskProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <h3 className="font-semibold text-gray-900">
        {task.title}
      </h3>

      {task.description && (
        <p className="mt-1 text-sm text-gray-600">
          {task.description}
        </p>
      )}

      <div className="mt-4 flex gap-2">
        <ViewTask task={task} />

        <UpdateTask task={task} />

        <DeleteTask
          taskId={task.id}
          onDeleted={onDelete}
        />
      </div>
    </div>
  );
}