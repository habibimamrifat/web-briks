"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1000 : "auto",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition ${
        isDragging
          ? "relative opacity-40 blur-[1px]"
          : ""
      }`}
    >
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