"use client";

import { useState } from "react";
import EachTask from "@/components/task/EachTask";
import { Task } from "@/types/allTypes";
import ViewState from "./ViewState";
import UpdateState from "./UpdateState";
import DeleteState from "./DeleteState";

type WorkflowState = {
  id: string;
  name: string;
  position: number;
  startDate: string | null;
  finishDate: string | null;
};

type BoardStateProps = {
  state: WorkflowState;
  tasks: Task[];
  onDeleted: () => void;
};

export default function BoardState({
  state,
  tasks: initialTasks,
  onDeleted,
}: BoardStateProps) {
  const [tasks, setTasks] = useState(initialTasks);

  const handleDeleteTask = (taskId: string) => {
    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== taskId),
    );
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
      {/* State actions */}
      <div className="mb-4 flex items-center justify-between">
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

      {/* Tasks */}
      <div className="space-y-3">
        {tasks.length === 0 ? (
          <p className="text-sm text-gray-500">
            No tasks
          </p>
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
    </div>
  );
}