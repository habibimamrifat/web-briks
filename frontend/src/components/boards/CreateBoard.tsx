'use client';

import { useRouter } from 'next/navigation';

export default function CreateBoard() {
  const router = useRouter();

  const handleCreate = () => {
    router.push('/dashboard/boards/create');
  };

  return (
    <button
      type="button"
      onClick={handleCreate}
      className="rounded-lg bg-gray-900 px-4 py-2 font-semibold text-white hover:bg-gray-800"
    >
      Create Board
    </button>
  );
}