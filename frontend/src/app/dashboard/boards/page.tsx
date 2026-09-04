'use client';

import { sendGetRequest } from '@/apis/getRequest';
import { useEffect, useState } from 'react';

import CreateBoard from '@/components/boards/CreateBoard';
import ViewBoard from '@/components/boards/ViewBoard';
import EditBoard from '@/components/boards/EditBoard';
import DeleteBoard from '@/components/boards/DeleteBoard';

type Board = {
  id: string;
  name: string;
  description: string | null;
  creatorUserId: string;
  startDate: string | null;
  finishDate: string | null;
  createdAt: string;
  updatedAt: string;
};

export default function BoardsPage() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBoards() {
      try {
        const data = await sendGetRequest(
          '/boards',
          'BoardsPage',
          {
            requiredAuth: true,
          },
        );

        setBoards(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchBoards();
  }, []);

  const handleBoardDeleted = (boardId: string) => {
    setBoards((currentBoards) =>
      currentBoards.filter(
        (board) => board.id !== boardId,
      ),
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <p className="text-gray-700">Loading boards...</p>
      </div>
    );
  }

  return (
    <div className="px-6 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Boards
            </h1>

            <p className="mt-1 text-gray-600">
              Manage your boards
            </p>
          </div>

          <CreateBoard />
        </div>

        {boards.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
            <p className="text-gray-600">
              No boards found.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {boards.map((board) => (
              <div
                key={board.id}
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <h2 className="text-xl font-bold text-gray-900">
                  {board.name}
                </h2>

                <p className="mt-2 min-h-10 text-sm text-gray-600">
                  {board.description ||
                    'No description provided.'}
                </p>

                <div className="mt-5 border-t border-gray-100 pt-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs font-medium text-gray-500">
                        Start Date
                      </p>

                      <p className="mt-1 text-sm text-gray-600">
                        {board.startDate
                          ? new Date(
                              board.startDate,
                            ).toLocaleDateString()
                          : 'Not set'}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-gray-500">
                        Finish Date
                      </p>

                      <p className="mt-1 text-sm text-gray-600">
                        {board.finishDate
                          ? new Date(
                              board.finishDate,
                            ).toLocaleDateString()
                          : 'Not set'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex gap-2">
                  <ViewBoard boardId={board.id} />

                  <EditBoard boardId={board.id} />

                  <DeleteBoard
                    boardId={board.id}
                    onDeleted={handleBoardDeleted}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}