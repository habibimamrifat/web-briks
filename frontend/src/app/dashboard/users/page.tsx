
'use client';

import { useEffect, useState } from 'react';

type User = {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'MEMBER';
  image?: string | null;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    async function fetchUsers() {
      const authData = localStorage.getItem('webBriksAuth');

      if (!authData) return;

      const { accessToken } = JSON.parse(authData);

      const response = await fetch('http://localhost:3000/users', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();

      setUsers(data);
    }

    fetchUsers();
  }, []);

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">
        Users
      </h1>

      <div className="rounded-lg border bg-white">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between border-b p-4 last:border-b-0"
          >
            <div>
              <h2 className="font-semibold">
                {user.name}
              </h2>

              <p className="text-gray-600">
                {user.email}
              </p>
            </div>

            <span className="rounded bg-gray-100 px-3 py-1 text-sm">
              {user.role}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
