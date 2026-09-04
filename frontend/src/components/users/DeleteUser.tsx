'use client';

import { callApis } from '@/apis/callApi';

type DeleteUserProps = {
  userId: string;
  onDeleted: (userId: string) => void;
};

export default function DeleteUser({
  userId,
  onDeleted,
}: DeleteUserProps) {
  const handleDelete = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this user?',
    );

    if (!confirmed) {
      return;
    }

    try {
      await callApis(
        `/users/${userId}`,
        'DeleteUserComponent',
        {
          method: 'DELETE',
          requiredAuth: true,
        },
      );

      onDeleted(userId);
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