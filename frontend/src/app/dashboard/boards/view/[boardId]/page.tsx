'use client';

import { sendGetRequest } from '@/apis/getRequest';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

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

export default function ViewBoardPage() {
  const params = useParams<{ boardId: string }>();

  const boardId = params.boardId;

  const [board, setBoard] = useState<Board | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBoard() {
      try {
        const data: Board = await sendGetRequest(
          `/boards/${boardId}`,
          'ViewBoardPage',
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
    }

    fetchBoard();
  }, [boardId]);

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <p className="text-gray-700">Loading board...</p>
      </div>
    );
  }

  if (!board) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <p className="text-gray-700">Board not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] px-6 py-8">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900">
            {board.name}
          </h1>

          <p className="mt-3 text-gray-600">
            {board.description ||
              'No description provided.'}
          </p>

          <div className="mt-8 grid grid-cols-1 gap-6 border-t border-gray-200 pt-6 sm:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Start Date
              </p>

              <p className="mt-1 text-gray-600">
                {board.startDate
                  ? new Date(
                      board.startDate,
                    ).toLocaleDateString()
                  : 'Not set'}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">
                Finish Date
              </p>

              <p className="mt-1 text-gray-600">
                {board.finishDate
                  ? new Date(
                      board.finishDate,
                    ).toLocaleDateString()
                  : 'Not set'}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">
                Created At
              </p>

              <p className="mt-1 text-gray-600">
                {new Date(
                  board.createdAt,
                ).toLocaleDateString()}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">
                Board ID
              </p>

              <p className="mt-1 break-all text-sm text-gray-600">
                {board.id}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}