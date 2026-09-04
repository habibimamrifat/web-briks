'use client';

import { useRouter } from 'next/navigation';

type ViewUserProps = {
  userId: string;
};

export default function ViewUser({
  userId,
}: ViewUserProps) {
  const router = useRouter();

  const handleView = () => {
    router.push(`/dashboard/users/viewuser/${userId}`);
  };

  return (
    <button
      type="button"
      onClick={handleView}
      className="cursor-pointer rounded-lg border border-gray-900 bg-white px-3 py-1.5 text-sm font-semibold text-gray-900 hover:bg-gray-100"
    >
      View
    </button>
  );
}