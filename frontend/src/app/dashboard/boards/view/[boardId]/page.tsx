
"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import {
  CollisionDetection,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  arrayMove,
  useSortable,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

import { sendGetRequest } from "@/apis/getRequest";
import { callApis } from "@/apis/callApi";

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
  description?: string | null;
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

type SortableBoardStateProps = {
  boardId: string;
  state: WorkflowState;
  tasks: Task[];
  onDeleted: () => void;
  onTaskCreated: (task: Task) => void;
  onTaskDeleted: (taskId: string) => void;
  isOver: boolean;
};

/*
 * When dragging a workflow state,
 * only workflow states can be drop targets.
 *
 * When dragging a task,
 * keep the existing task collision behavior.
 */
const collisionDetectionStrategy: CollisionDetection = (
  args,
) => {
  const activeId = String(args.active.id);

  if (activeId.startsWith("state-")) {
    const stateContainers =
      args.droppableContainers.filter(
        (container) =>
          String(container.id).startsWith(
            "state-",
          ),
      );

    return closestCenter({
      ...args,
      droppableContainers:
        stateContainers,
    });
  }

  return closestCenter(args);
};

function SortableBoardState({
  boardId,
  state,
  tasks,
  onDeleted,
  onTaskCreated,
  onTaskDeleted,
  isOver,
}: SortableBoardStateProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `state-${state.id}`,
  });

  const style = {
    transform: CSS.Transform.toString(
      transform,
    ),
    transition,
    zIndex: isDragging ? 1000 : "auto",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative transition ${
        isDragging
          ? "opacity-40"
          : isOver
            ? "opacity-50 blur-[1px]"
            : ""
      }`}
    >
      <div
        {...attributes}
        {...listeners}
        className="absolute left-2 top-5 z-20 flex h-7 w-7 cursor-grab touch-none items-center justify-center rounded text-lg text-gray-400 hover:bg-gray-200 hover:text-gray-700 active:cursor-grabbing"
        title="Drag workflow state"
      >
        ⠿
      </div>

      <BoardState
        boardId={boardId}
        state={state}
        tasks={tasks}
        onDeleted={onDeleted}
        onTaskCreated={onTaskCreated}
        onTaskDeleted={onTaskDeleted}
      />
    </div>
  );
}

export default function ViewBoardPage() {
  const params =
    useParams<{ boardId: string }>();

  const [board, setBoard] =
    useState<Board | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [activeState, setActiveState] =
    useState<WorkflowState | null>(
      null,
    );

  const [activeTask, setActiveTask] =
    useState<Task | null>(null);

  /*
   * State currently underneath
   * the dragged workflow state.
   */
  const [overStateId, setOverStateId] =
    useState<string | null>(null);

  /*
   * Require the pointer to move
   * before starting a drag.
   *
   * This prevents normal button
   * clicks from being treated
   * as drag operations.
   */
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const fetchBoard = async () => {
    try {
      const data =
        await sendGetRequest(
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

  useEffect(() => {
    let cancelled = false;

    async function loadBoard() {
      try {
        const data =
          await sendGetRequest(
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

  const handleTaskCreated = (
    task: Task,
  ) => {
    setBoard((currentBoard) => {
      if (!currentBoard) {
        return currentBoard;
      }

      return {
        ...currentBoard,
        tasks: [
          ...currentBoard.tasks,
          task,
        ],
      };
    });
  };

  const handleTaskDeleted = (
    taskId: string,
  ) => {
    setBoard((currentBoard) => {
      if (!currentBoard) {
        return currentBoard;
      }

      return {
        ...currentBoard,
        tasks:
          currentBoard.tasks.filter(
            (task) =>
              task.id !== taskId,
          ),
      };
    });
  };

  /*
   * Start dragging.
   */
  const handleDragStart = (
    event: DragStartEvent,
  ) => {
    if (!board) {
      return;
    }

    const id = String(
      event.active.id,
    );

    /*
     * STATE
     */
    if (id.startsWith("state-")) {
      const stateId = id.replace(
        "state-",
        "",
      );

      const state =
        board.states.find(
          (item) =>
            item.id === stateId,
        );

      if (state) {
        setActiveState(state);
      }

      setOverStateId(null);

      return;
    }

    /*
     * TASK
     */
    const task =
      board.tasks.find(
        (item) =>
          item.id === id,
      );

    if (task) {
      setActiveTask(task);
    }
  };

  /*
   * Track which state the
   * dragged state is currently
   * positioned over.
   *
   * This only changes UI.
   *
   * No API call happens here.
   */
  const handleDragOver = (
    event: DragOverEvent,
  ) => {
    const activeId = String(
      event.active.id,
    );

    const overId = event.over
      ? String(event.over.id)
      : null;

    /*
     * Only track this when
     * dragging a workflow state.
     */
    if (
      !activeId.startsWith(
        "state-",
      )
    ) {
      setOverStateId(null);
      return;
    }

    /*
     * Cursor is over another
     * workflow state.
     */
    if (
      overId &&
      overId.startsWith("state-") &&
      overId !== activeId
    ) {
      setOverStateId(overId);
      return;
    }

    /*
     * Cursor is not over
     * another workflow state.
     */
    setOverStateId(null);
  };

  /*
   * STATE MOVEMENT
   *
   * Example:
   *
   * Before:
   *
   * A -> 0
   * B -> 1
   * C -> 2
   * D -> 3
   *
   * Move A -> C
   *
   * After:
   *
   * B -> 0
   * C -> 1
   * A -> 2
   * D -> 3
   */
  const moveState = async (
    activeId: string,
    overId: string,
  ) => {
    if (!board) {
      return;
    }

    const activeStateId =
      activeId.replace(
        "state-",
        "",
      );

    const overStateId =
      overId.replace(
        "state-",
        "",
      );

    if (
      activeStateId ===
      overStateId
    ) {
      return;
    }

    /*
     * Always make a copy
     * before sorting.
     */
    const currentStates = [
      ...board.states,
    ].sort(
      (a, b) =>
        a.position - b.position,
    );

    /*
     * Find dragged state.
     */
    const oldIndex =
      currentStates.findIndex(
        (state) =>
          state.id ===
          activeStateId,
      );

    /*
     * Find target state.
     */
    const newIndex =
      currentStates.findIndex(
        (state) =>
          state.id ===
          overStateId,
      );

    if (
      oldIndex === -1 ||
      newIndex === -1
    ) {
      return;
    }

    /*
     * Move the state.
     */
    const reorderedStates =
      arrayMove(
        currentStates,
        oldIndex,
        newIndex,
      );

    /*
     * Reassign EVERY position.
     */
    const updatedStates =
      reorderedStates.map(
        (state, index) => ({
          ...state,
          position: index,
        }),
      );

    /*
     * Optimistic UI update.
     */
    setBoard((currentBoard) => {
      if (!currentBoard) {
        return currentBoard;
      }

      return {
        ...currentBoard,
        states: updatedStates,
      };
    });

    /*
     * Persist EVERY state.
     *
     * This happens only after
     * the cursor is released.
     */
    try {
      await Promise.all(
        updatedStates.map(
          async (state) => {
            await callApis(
              `/workflow-states/${state.id}`,
              "ViewBoardPage",
              {
                method: "PATCH",
                body: {
                  position:
                    state.position,
                },
                requiredAuth: true,
              },
            );
          },
        ),
      );
    } catch (error) {
      console.error(error);

      /*
       * Restore backend state
       * if persistence fails.
       */
      await fetchBoard();
    }
  };

  /*
   * TASK MOVEMENT
   *
   * Existing task movement
   * behavior is preserved.
   */
  const moveTask = async (
    activeId: string,
    overId: string,
  ) => {
    if (!board) {
      return;
    }

    const draggedTask =
      board.tasks.find(
        (task) =>
          task.id === activeId,
      );

    if (!draggedTask) {
      return;
    }

    /*
     * Determine target state.
     *
     * Dropped on state:
     *
     * drop-state-STATE_ID
     *
     * Dropped on task:
     *
     * TASK_ID
     */
    let targetStateId:
      string | null = null;

    let targetTask: Task | null =
      null;

    if (
      overId.startsWith(
        "drop-state-",
      )
    ) {
      targetStateId =
        overId.replace(
          "drop-state-",
          "",
        );
    } else {
      targetTask =
        board.tasks.find(
          (task) =>
            task.id === overId,
        ) ?? null;

      if (targetTask) {
        targetStateId =
          targetTask.workflowStateId;
      }
    }

    if (!targetStateId) {
      return;
    }

    /*
     * Get tasks from target
     * state in their current order.
     */
    const targetTasks =
      board.tasks
        .filter(
          (task) =>
            task.workflowStateId ===
            targetStateId,
        )
        .sort(
          (a, b) =>
            a.priorityIndex -
            b.priorityIndex,
        );

    /*
     * Remove dragged task if
     * it already exists in this state.
     */
    const filteredTasks =
      targetTasks.filter(
        (task) =>
          task.id !== activeId,
      );

    /*
     * Default:
     * append to the end.
     */
    let newIndex =
      filteredTasks.length;

    /*
     * If dropped on another task,
     * insert before that task.
     */
    if (targetTask) {
      const targetIndex =
        filteredTasks.findIndex(
          (task) =>
            task.id ===
            targetTask?.id,
        );

      if (targetIndex !== -1) {
        newIndex = targetIndex;
      }
    }

    /*
     * Build new task order.
     */
    const reorderedTasks = [
      ...filteredTasks,
    ];

    reorderedTasks.splice(
      newIndex,
      0,
      draggedTask,
    );

    /*
     * Reassign task positions.
     */
    const updatedTasks =
      reorderedTasks.map(
        (task, index) => ({
          ...task,
          workflowStateId:
            targetStateId!,
          priorityIndex: index,
        }),
      );

    /*
     * Optimistic UI update.
     */
    setBoard((currentBoard) => {
      if (!currentBoard) {
        return currentBoard;
      }

      const affectedTaskIds =
        new Set(
          updatedTasks.map(
            (task) => task.id,
          ),
        );

      const remainingTasks =
        currentBoard.tasks.filter(
          (task) =>
            !affectedTaskIds.has(
              task.id,
            ),
        );

      return {
        ...currentBoard,
        tasks: [
          ...remainingTasks,
          ...updatedTasks,
        ],
      };
    });

    /*
     * Persist task positions.
     */
    try {
      await Promise.all(
        updatedTasks.map(
          async (task) => {
            await callApis(
              `/tasks/${task.id}`,
              "ViewBoardPage",
              {
                method: "PATCH",
                body: {
                  workflowStateId:
                    task.workflowStateId,
                  priorityIndex:
                    task.priorityIndex,
                },
                requiredAuth: true,
              },
            );
          },
        ),
      );
    } catch (error) {
      console.error(error);

      await fetchBoard();
    }
  };

  /*
   * Drag end.
   *
   * This is where state/task
   * movement is actually persisted.
   */
  const handleDragEnd = async (
    event: DragEndEvent,
  ) => {
    const { active, over } =
      event;

    setActiveState(null);
    setActiveTask(null);
    setOverStateId(null);

    if (!over || !board) {
      return;
    }

    const activeId = String(
      active.id,
    );

    const overId = String(
      over.id,
    );

    /*
     * STATE MOVEMENT
     */
    if (
      activeId.startsWith(
        "state-",
      )
    ) {
      /*
       * State can only be
       * dropped on another state.
       */
      if (
        !overId.startsWith(
          "state-",
        )
      ) {
        return;
      }

      await moveState(
        activeId,
        overId,
      );

      return;
    }

    /*
     * TASK MOVEMENT
     */
    await moveTask(
      activeId,
      overId,
    );
  };

  const handleDragCancel = () => {
    setActiveState(null);
    setActiveTask(null);
    setOverStateId(null);
  };

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <p className="text-gray-700">
          Loading board...
        </p>
      </div>
    );
  }

  if (!board) {
    return (
      <div className="p-8">
        <p className="text-gray-700">
          Board not found.
        </p>
      </div>
    );
  }

  /*
   * Always copy before sorting.
   */
  const sortedStates = [
    ...board.states,
  ].sort(
    (a, b) =>
      a.position - b.position,
  );

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
                {board.description ||
                  "No description provided."}
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
              {board.members.length ===
              0 ? (
                <p className="text-sm text-gray-500">
                  No members available.
                </p>
              ) : (
                board.members.map(
                  (member) => (
                    <div
                      key={
                        member.user.id
                      }
                      className="rounded-lg border border-gray-200 px-4 py-3"
                    >
                      <div className="flex items-center gap-2">
                        {member.user
                          .image ? (
                          <Image
                            src={
                              member.user
                                .image
                            }
                            alt={
                              member.user
                                .name
                            }
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
                          {
                            member.user
                              .name
                          }
                        </p>
                      </div>

                      <p className="mt-1 text-sm text-gray-500">
                        {
                          member.user
                            .email
                        }
                      </p>
                    </div>
                  ),
                )
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

          <DndContext
            sensors={sensors}
            collisionDetection={
              collisionDetectionStrategy
            }
            onDragStart={
              handleDragStart
            }
            onDragOver={
              handleDragOver
            }
            onDragEnd={
              handleDragEnd
            }
            onDragCancel={
              handleDragCancel
            }
          >
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
              {sortedStates.map(
                (state) => {
                  const stateTasks =
                    board.tasks
                      .filter(
                        (task) =>
                          task.workflowStateId ===
                          state.id,
                      )
                      .sort(
                        (a, b) =>
                          a.priorityIndex -
                          b.priorityIndex,
                      );

                  return (
                    <SortableBoardState
                      key={state.id}
                      boardId={board.id}
                      state={state}
                      tasks={stateTasks}
                      onDeleted={
                        fetchBoard
                      }
                      onTaskCreated={
                        handleTaskCreated
                      }
                      onTaskDeleted={
                        handleTaskDeleted
                      }
                      isOver={
                        overStateId ===
                        `state-${state.id}`
                      }
                    />
                  );
                },
              )}

              <AddState
                boardId={board.id}
                onCreated={
                  fetchBoard
                }
              />
            </div>

            {/* Drag Overlay */}
            <DragOverlay>
              {activeState ? (
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 shadow-xl">
                  <div className="flex items-center gap-2">
                    <span className="text-lg text-gray-400">
                      ⠿
                    </span>

                    <h3 className="text-lg font-bold text-gray-900">
                      {
                        activeState.name
                      }
                    </h3>
                  </div>
                </div>
              ) : activeTask ? (
                <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-xl">
                  <h3 className="font-semibold text-gray-900">
                    {
                      activeTask.title
                    }
                  </h3>

                  {activeTask.description && (
                    <p className="mt-1 text-sm text-gray-600">
                      {
                        activeTask.description
                      }
                    </p>
                  )}
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      </div>
    </div>
  );
}

