"use client";

import { Task } from "@/types/allTypes";
import { useState } from "react";
import ViewTaskPopUp from "./ViewTaskPopUp";


type ViewTaskProps = {
  task: Task;
};

export default function ViewTask({ task }: ViewTaskProps) {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setShowPopup(true)}
        className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
      >
        View
      </button>

      {showPopup && (
        <ViewTaskPopUp
          taskId={task.id}
          onClose={() => setShowPopup(false)}
        />
      )}
    </>
  );
}