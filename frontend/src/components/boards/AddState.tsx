"use client";

import { callApis } from "@/apis/callApi";
import { useState } from "react";


type AddStateProps = {
  boardId: string;
  onCreated: () => void;
};

export default function AddState({
  boardId,
  onCreated,
}: AddStateProps) {
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [startDate, setStartDate] = useState("");
  const [finishDate, setFinishDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    event: React.SyntheticEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!name.trim()) {
      return;
    }

    try {
      setLoading(true);

      const body = {
        name: name.trim(),

        ...(position !== "" && {
          position: Number(position),
        }),

        ...(startDate && {
          startDate: new Date(startDate).toISOString(),
        }),

        ...(finishDate && {
          finishDate: new Date(finishDate).toISOString(),
        }),
      };

      await callApis(
        `/workflow-states/board/${boardId}`,
        "AddStateComponent",
        {
          method: "POST",
          body,
          requiredAuth: true,
        },
      );

      setName("");
      setPosition("");
      setStartDate("");
      setFinishDate("");

      onCreated();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-dashed border-gray-300 bg-white p-5">
      <h3 className="text-lg font-bold text-gray-900">
        Add State
      </h3>

      <form
        onSubmit={handleSubmit}
        className="mt-4 space-y-4"
      >
        <div>
          <label
            htmlFor="state-name"
            className="block text-sm font-medium text-gray-700"
          >
            State Name
          </label>

          <input
            id="state-name"
            type="text"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            placeholder="e.g. In Progress"
            required
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-gray-900"
          />
        </div>

        <div>
          <label
            htmlFor="state-position"
            className="block text-sm font-medium text-gray-700"
          >
            Position
          </label>

          <input
            id="state-position"
            type="number"
            min="0"
            value={position}
            onChange={(event) =>
              setPosition(event.target.value)
            }
            placeholder="Optional"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-gray-900"
          />
        </div>

        <div>
          <label
            htmlFor="state-start-date"
            className="block text-sm font-medium text-gray-700"
          >
            Start Date
          </label>

          <input
            id="state-start-date"
            type="date"
            value={startDate}
            onChange={(event) =>
              setStartDate(event.target.value)
            }
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-gray-900"
          />
        </div>

        <div>
          <label
            htmlFor="state-finish-date"
            className="block text-sm font-medium text-gray-700"
          >
            Finish Date
          </label>

          <input
            id="state-finish-date"
            type="date"
            value={finishDate}
            onChange={(event) =>
              setFinishDate(event.target.value)
            }
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-gray-900"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create State"}
        </button>
      </form>
    </div>
  );
}