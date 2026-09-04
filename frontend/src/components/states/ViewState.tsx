"use client";

import { useState } from "react";
import ViewStatePopUp from "./ViewStatePopUp";


type ViewStateProps = {
  stateId: string;
};

export default function ViewState({
  stateId,
}: ViewStateProps) {
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
        <ViewStatePopUp
          stateId={stateId}
          onClose={() => setShowPopup(false)}
        />
      )}
    </>
  );
}