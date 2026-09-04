"use client";

import { useState } from "react";
import UpdateStatePopUp from "./UpdateStatePopUp";


type UpdateStateProps = {
  stateId: string;
};

export default function UpdateState({
  stateId,
}: UpdateStateProps) {
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
        <UpdateStatePopUp
          stateId={stateId}
          onClose={() => setShowPopup(false)}
        />
      )}
    </>
  );
}