"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { sendGetRequest } from "@/apis/getRequest";
import AddMember from "@/components/boards/AddMember";
import AddState from "@/components/boards/AddState";
import BoardState from "@/components/states/EachState";

type Member = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: "ADMIN" | "MEMBER";
};

type WorkflowState = {
  id: string;
  name: string;
  position: number;
  startDate: string | null;
  finishDate: string | null;
  createdAt: string;
  updatedAt: string;
};

type TaskAssignee = {
  id: string;
  user: Member;
};

type Task = {
  id: string;
  title: string;
  description: string | null;
  workflowStateId: string;
  priorityIndex: number;
  startDate: string | null;
  finishDate: string | null;
  assignees: TaskAssignee[];
};

type Board = {
  id: string;
  name: string;
  description: string | null;
  creatorUserId: string;
  startDate: string | null;
  finishDate: string | null;
  createdAt: string;
  updatedAt: string;

  members: {
    user: Member;
  }[];

  states: WorkflowState[];

  tasks: Task[];
};

export default function ViewBoardPage() {
  const params = useParams<{ boardId: string }>();

  const [board, setBoard] = useState<Board | null>(null);
  const [loading, setLoading] = useState(true);

  /*
   * Used when we need to refresh the board
   * after adding/removing members, states, etc.
   */
  const fetchBoard = async () => {
    try {
      const data = await sendGetRequest(
        `/boards/${params.boardId}`,
        "ViewBoardPage",
        {
          requiredAuth: true,
        },
      );

      setBoard(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /*
   * Initial board loading
   */
  useEffect(() => {
    let cancelled = false;

    async function loadBoard() {
      try {
        const data = await sendGetRequest(
          `/boards/${params.boardId}`,
          "ViewBoardPage",
          {
            requiredAuth: true,
          },
        );

        if (!cancelled) {
          setBoard(data);
          setLoading(false);
        }
      } catch (error) {
        if (!cancelled) {
          console.error(error);
          setLoading(false);
        }
      }
    }

    loadBoard();

    return () => {
      cancelled = true;
    };
  }, [params.boardId]);

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <p className="text-gray-700">Loading board...</p>
      </div>
    );
  }

  if (!board) {
    return (
      <div className="p-8">
        <p className="text-gray-700">Board not found.</p>
      </div>
    );
  }

  return (
    <div className="px-6 py-8">
      <div className="mx-auto max-w-7xl">
        {/* Board Details */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {board.name}
              </h1>

              <p className="mt-2 text-gray-600">
                {board.description || "No description provided."}
              </p>
            </div>
          </div>

          {/* Board Dates */}
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Start Date
              </p>

              <p className="mt-1 text-gray-700">
                {board.startDate
                  ? new Date(
                      board.startDate,
                    ).toLocaleDateString()
                  : "Not set"}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">
                Finish Date
              </p>

              <p className="mt-1 text-gray-700">
                {board.finishDate
                  ? new Date(
                      board.finishDate,
                    ).toLocaleDateString()
                  : "Not set"}
              </p>
            </div>
          </div>

          {/* Members */}
          <div className="mt-8 border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Members
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Members associated with this board
                </p>
              </div>

              <AddMember
                boardId={board.id}
                members={board.members}
                onUpdated={fetchBoard}
              />
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              {board.members.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No members available.
                </p>
              ) : (
                board.members.map((member) => (
                  <div
                    key={member.user.id}
                    className="rounded-lg border border-gray-200 px-4 py-3"
                  >
                    <div className="flex items-center gap-2">
                      {member.user.image ? (
                        <Image
                          src={member.user.image}
                          alt={member.user.name}
                          width={32}
                          height={32}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold text-gray-600">
                          {member.user.name
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                      )}

                      <p className="font-semibold text-gray-900">
                        {member.user.name}
                      </p>
                    </div>

                    <p className="mt-1 text-sm text-gray-500">
                      {member.user.email}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Workflow States */}
        <div className="mt-8">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Workflow States
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            {board.states.map((state) => {
              const stateTasks = board.tasks.filter(
                (task) =>
                  task.workflowStateId === state.id,
              );

              return (
                <BoardState
                  key={state.id}
                  state={state}
                  tasks={stateTasks}
                  onDeleted={fetchBoard}
                />
              );
            })}

            {/* Add State */}
            <AddState
              boardId={board.id}
              onCreated={fetchBoard}
            />
          </div>
        </div>
      </div>
    </div>
  );
}