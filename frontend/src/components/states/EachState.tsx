"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import EachTask from "@/components/task/EachTask";
import { Task } from "@/types/allTypes";

import ViewState from "./ViewState";
import UpdateState from "./UpdateState";
import DeleteState from "./DeleteState";
import AddTask from "./AddTask";

type WorkflowState = {
  id: string;
  name: string;
  description?: string | null;
  position: number;
  startDate: string | null;
  finishDate: string | null;
};

type BoardStateProps = {
  boardId: string;
  state: WorkflowState;
  tasks: Task[];
  onDeleted: () => void;
  onTaskCreated?: (task: Task) => void;
  onTaskDeleted?: (taskId: string) => void;
};

export default function BoardState({
  boardId,
  state,
  tasks,
  onDeleted,
  onTaskCreated,
  onTaskDeleted,
}: BoardStateProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `drop-state-${state.id}`,
  });

  const handleDeleteTask = (taskId: string) => {
    onTaskDeleted?.(taskId);
  };

  const handleTaskCreated = (task: Task) => {
    onTaskCreated?.(task);
  };

  return (
    <div className="flex h-[600px] flex-col rounded-xl border border-gray-200 bg-gray-50 p-4">
      {/* State Header */}
      <div className="shrink-0 pl-7">
        <div className="flex items-center justify-between flex-col gap-2">
          <h3 className="text-lg font-bold text-gray-900">
            {state.name}
          </h3>

          <div className="flex gap-2">
            <ViewState stateId={state.id} />

            <UpdateState stateId={state.id} />

            <DeleteState
              stateId={state.id}
              onDeleted={onDeleted}
            />
          </div>
        </div>

        {state.description && (
          <p className="mt-1 text-sm text-gray-600">
            {state.description}
          </p>
        )}

        <div className="mt-3">
          <AddTask
            boardId={boardId}
            workflowStateId={state.id}
            onCreated={handleTaskCreated}
          />
        </div>
      </div>

      {/* Tasks */}
      <div
        ref={setNodeRef}
        className={`hide-scrollbar mt-4 flex-1 overflow-y-auto rounded-lg transition ${
          isOver ? "bg-gray-200" : ""
        }`}
      >
        <SortableContext
          items={tasks.map((task) => task.id)}
          strategy={verticalListSortingStrategy}
        >
         <div className="min-h-full space-y-3 pr-2 flex flex-col">
  {tasks.length === 0 ? (
    <div className="flex flex-1 items-center justify-center">
      <p className="text-sm text-gray-500">
        No tasks
      </p>
    </div>
  ) : (
    tasks.map((task) => (
      <EachTask
        key={task.id}
        task={task}
        onDelete={handleDeleteTask}
      />
    ))
  )}
</div>
        </SortableContext>
      </div>
    </div>
  );
}