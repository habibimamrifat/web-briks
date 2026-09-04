'use client';

import { useRouter } from 'next/navigation';

type ViewBoardProps = {
  boardId: string;
};

export default function ViewBoard({
  boardId,
}: ViewBoardProps) {
  const router = useRouter();

  const handleView = () => {
    router.push(`/dashboard/boards/view/${boardId}`);
  };

  return (
    <button
      type="button"
      onClick={handleView}
      className="rounded-lg border border-gray-900 bg-white px-3 py-1.5 text-sm font-semibold text-gray-900 hover:bg-gray-100"
    >
      View
    </button>
  );
}