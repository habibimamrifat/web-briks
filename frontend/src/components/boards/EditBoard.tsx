'use client';

import { useRouter } from 'next/navigation';

type EditBoardProps = {
  boardId: string;
};

export default function EditBoard({
  boardId,
}: EditBoardProps) {
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/dashboard/boards/edit/${boardId}`);
  };

  return (
    <button
      type="button"
      onClick={handleEdit}
      className="rounded-lg border border-gray-900 bg-white px-3 py-1.5 text-sm font-semibold text-gray-900 hover:bg-gray-100"
    >
      Edit
    </button>
  );
}