'use client';

import { sendGetRequest } from '@/apis/getRequest';
import { useEffect, useState } from 'react';
import CreateUser from '../../../components/users/CreateUser';
import ViewUser from '../../../components/users/ViewUser';
import EditUser from '../../../components/users/EditUser';
import DeleteUser from '../../../components/users/DeleteUser';

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
      try {
        const data = await sendGetRequest(
          '/users',
          'UsersComponent',
          {
            requiredAuth: true,
          },
        );

        console.log('Fetched users:', data);
        setUsers(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchUsers();
  }, []);


  const handleUserDeleted = (userId: string) => {
  setUsers((currentUsers) =>
    currentUsers.filter((user) => user.id !== userId),
  );
};

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">
          Users
        </h1>

       <CreateUser />
      </div>

      <div className="rounded-lg border bg-white">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between border-b p-4 last:border-b-0"
          >
            <div>
              <h2 className="font-semibold text-gray-900">
                {user.name}
              </h2>

              <p className="text-gray-600">
                {user.email}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`rounded px-3 py-1 text-sm font-semibold ${
                    user.role === 'MEMBER'
                    ? 'bg-white text-gray-700 border border-gray-300'
                    : 'bg-gray-700 text-white'
                }`}>
                {user.role}
              </span>

              <ViewUser userId={user.id} />
              <EditUser userId={user.id} />
              <DeleteUser userId={user.id}
  onDeleted={handleUserDeleted} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}