'use client';

import { useEffect, useState } from 'react';
import { sendGetRequest } from '@/apis/getRequest';

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  image: string | null;
  createdAt: string;
};

type Board = {
  id: string;
  name: string;
  description: string | null;
  creatorUserId: string;
  startDate: string | null;
  finishDate: string | null;
  createdAt: string;
  owner: {
    id: string;
    name: string;
    email: string;
  };
};

type Task = {
  id: string;
  title: string;
  description: string | null;
  priorityIndex: number;
  startDate: string | null;
  finishDate: string | null;
  createdAt: string;

  board: {
    id: string;
    name: string;
  };

  workflowState: {
    id: string;
    name: string;
    position: number;
  };

  user: {
    id: string;
    name: string;
    email: string;
  };

  assignees: {
    user: {
      id: string;
      name: string;
      email: string;
      image: string | null;
    };
  }[];
};

type DashboardData = {
  statistics: {
    totalUsers: number;
    totalBoards: number;
    totalTasks: number;
    totalWorkflowStates: number;
  };

  recentUsers: User[];
  recentBoards: Board[];
  recentTasks: Task[];
};

export default function DashboardPage() {
  const [dashboard, setDashboard] =
    useState<DashboardData | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError('');

        const data = await sendGetRequest(
          '/dashboard',
          'DashboardPage',
          {
            requiredAuth: true,
          },
        );

        setDashboard(data as DashboardData);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : 'Failed to load dashboard',
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-full items-center justify-center">
        <p className="text-gray-600">
          Loading dashboard...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-sm text-red-600">
          {error}
        </p>
      </div>
    );
  }

  if (!dashboard) {
    return null;
  }

  const {
    statistics,
    recentUsers,
    recentBoards,
    recentTasks,
  } = dashboard;

  return (
    <div className="space-y-8">
      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Dashboard
        </h1>

        <p className="mt-1 text-gray-600">
          Overview of your Web Briks application.
        </p>
      </div>

      {/* Statistics */}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            Total Users
          </p>

          <p className="mt-2 text-3xl font-bold text-gray-900">
            {statistics.totalUsers}
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            Total Boards
          </p>

          <p className="mt-2 text-3xl font-bold text-gray-900">
            {statistics.totalBoards}
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            Total Tasks
          </p>

          <p className="mt-2 text-3xl font-bold text-gray-900">
            {statistics.totalTasks}
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            Workflow States
          </p>

          <p className="mt-2 text-3xl font-bold text-gray-900">
            {statistics.totalWorkflowStates}
          </p>
        </div>
      </div>

      {/* Recent Users */}

      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Users
          </h2>
        </div>

        <div className="divide-y divide-gray-200">
          {recentUsers.length === 0 ? (
            <p className="p-6 text-sm text-gray-500">
              No users found.
            </p>
          ) : (
            recentUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-6"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    {user.name}
                  </p>

                  <p className="text-sm text-gray-500">
                    {user.email}
                  </p>
                </div>

                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                  {user.role}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Recent Boards */}

      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Boards
          </h2>
        </div>

        <div className="divide-y divide-gray-200">
          {recentBoards.length === 0 ? (
            <p className="p-6 text-sm text-gray-500">
              No boards found.
            </p>
          ) : (
            recentBoards.map((board) => (
              <div
                key={board.id}
                className="p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      {board.name}
                    </p>

                    {board.description && (
                      <p className="mt-1 text-sm text-gray-500">
                        {board.description}
                      </p>
                    )}
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-700">
                      {board.owner.name}
                    </p>

                    <p className="text-xs text-gray-500">
                      {board.owner.email}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Recent Tasks */}

      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Tasks
          </h2>
        </div>

        <div className="divide-y divide-gray-200">
          {recentTasks.length === 0 ? (
            <p className="p-6 text-sm text-gray-500">
              No tasks found.
            </p>
          ) : (
            recentTasks.map((task) => (
              <div
                key={task.id}
                className="p-6"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900">
                      {task.title}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Board: {task.board.name}
                    </p>

                    <p className="text-sm text-gray-500">
                      Created by: {task.user.name}
                    </p>
                  </div>

                  <span className="shrink-0 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                    {task.workflowState.name}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}