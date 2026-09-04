'use client';

import { useRouter } from 'next/navigation';

export default function CreateUser() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.push('/dashboard/users/create')}
      className="cursor-pointer rounded-lg bg-gray-900 px-4 py-2 font-medium text-white hover:bg-gray-800"
    >
      Create User
    </button>
  );
}