
"use client";

import { useState } from "react";
import AddTaskPopup from "./AddTaskPopUp";
import { Task } from "@/types/allTypes";



type AddTaskProps = {
  boardId: string;
  workflowStateId: string;
  onCreated?: (task: Task) => void;
};

export default function AddTask({
  boardId,
  workflowStateId,
  onCreated,
}: AddTaskProps) {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setShowPopup(true)}
        className="w-full rounded-lg border border-dashed border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 hover:border-gray-400 hover:bg-gray-50 hover:text-gray-900"
      >
        + Add Task
      </button>

      {showPopup && (
        <AddTaskPopup
            boardId={boardId}
            workflowStateId={workflowStateId}
            onClose={() => setShowPopup(false)}
            onCreated={onCreated}
            />
      )}
    </>
  );
}

