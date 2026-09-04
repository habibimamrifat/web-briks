'use client';

import { useRouter } from 'next/navigation';

type EditUserProps = {
  userId: string;
};

export default function EditUser({
  userId,
}: EditUserProps) {
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/dashboard/users/edit/${userId}`);
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