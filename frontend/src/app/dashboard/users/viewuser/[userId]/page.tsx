'use client';

import Image from 'next/image';
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

type User = {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'MEMBER';
  image: string | null;
  createdAt: string;
  updatedAt: string;
  boards: Board[];
};

export default function ViewUserPage() {
  const params = useParams();
  const userId = params.userId as string;

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const data: User = await sendGetRequest(
          `/users/${userId}`,
          'ViewUserPage',
          {
            requiredAuth: true,
          },
        );

        setUser(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <p className="text-gray-700">Loading user...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <p className="text-gray-700">User not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] px-6 py-8">
      <div className="mx-auto max-w-5xl">
        {/* User Information */}
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="flex items-center gap-6">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name}
                width={100}
                height={100}
                className="h-24 w-24 rounded-full object-cover"
                unoptimized
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-200 text-3xl font-bold text-gray-600">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}

            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {user.name}
              </h1>

              <p className="mt-1 text-gray-600">
                {user.email}
              </p>

              <span className="mt-3 inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-700">
                {user.role}
              </span>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 border-t border-gray-200 pt-6 sm:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-gray-500">
                User ID
              </p>

              <p className="mt-1 break-all text-sm text-gray-600">
                {user.id}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">
                Created At
              </p>

              <p className="mt-1 text-sm text-gray-600">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Boards */}
        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Boards
              </h2>

              <p className="mt-1 text-gray-600">
                Boards this user is part of
              </p>
            </div>

            <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-700">
              {user.boards.length}
            </span>
          </div>

          {user.boards.length === 0 ? (
            <div className="mt-6 rounded-lg border border-dashed border-gray-300 p-8 text-center">
              <p className="text-gray-500">
                This user is not part of any board.
              </p>
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              {user.boards.map((board) => (
                <div
                  key={board.id}
                  className="rounded-xl border border-gray-200 p-5"
                >
                  <h3 className="text-lg font-semibold text-gray-800">
                    {board.name}
                  </h3>

                  <p className="mt-2 min-h-10 text-sm text-gray-600">
                    {board.description ||
                      'No description provided.'}
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-3 border-t border-gray-100 pt-4">
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
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}