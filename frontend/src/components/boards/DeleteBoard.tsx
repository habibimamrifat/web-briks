'use client';

import { callApis } from '@/apis/callApi';

type DeleteBoardProps = {
  boardId: string;
  onDeleted: (boardId: string) => void;
};

export default function DeleteBoard({
  boardId,
  onDeleted,
}: DeleteBoardProps) {
  const handleDelete = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this board?',
    );

    if (!confirmed) {
      return;
    }

    try {
      await callApis(
        `/boards/${boardId}`,
        'DeleteBoardComponent',
        {
          method: 'DELETE',
          requiredAuth: true,
        },
      );

      onDeleted(boardId);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="rounded-lg border border-red-300 bg-white px-3 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-50"
    >
      Delete
    </button>
  );
}