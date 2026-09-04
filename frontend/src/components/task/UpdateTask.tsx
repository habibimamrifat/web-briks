"use client";

import { useState } from "react";
import type { Task } from "@/types/allTypes";
import UpdateTaskPopUp from "./UpdateTaskPopUp";

type UpdateTaskProps = {
  task: Task;
};

export default function UpdateTask({
  task,
}: UpdateTaskProps) {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setShowPopup(true)}
        className="rounded-md bg-gray-900 px-3 py-1.5 text-sm text-white hover:bg-gray-800"
      >
        Update
      </button>

      {showPopup && (
        <UpdateTaskPopUp
          taskId={task.id}
          onClose={() => setShowPopup(false)}
        />
      )}
    </>
  );
}