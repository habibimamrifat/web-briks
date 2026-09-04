'use client';

import { callApis } from '@/apis/callApi';
import { sendGetRequest } from '@/apis/getRequest';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type Board = {
  id: string;
  name: string;
  description: string | null;
  startDate: string | null;
  finishDate: string | null;
};

export default function EditBoardPage() {
  const router = useRouter();
  const params = useParams<{ boardId: string }>();

  const boardId = params.boardId;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [finishDate, setFinishDate] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchBoard() {
      try {
        const data: Board = await sendGetRequest(
          `/boards/${boardId}`,
          'EditBoardPage',
          {
            requiredAuth: true,
          },
        );

        setName(data.name);
        setDescription(data.description ?? '');

        if (data.startDate) {
          setStartDate(data.startDate.slice(0, 10));
        }

        if (data.finishDate) {
          setFinishDate(data.finishDate.slice(0, 10));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchBoard();
  }, [boardId]);

  const handleSubmit = async (
    e: React.SyntheticEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    try {
      setSaving(true);

      await callApis(
        `/boards/${boardId}`,
        'EditBoardPage',
        {
          method: 'PATCH',
          body: {
            name,
            description: description || undefined,
            startDate: startDate || undefined,
            finishDate: finishDate || undefined,
          },
          requiredAuth: true,
        },
      );

      router.push('/dashboard/boards');
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <p className="text-gray-700">Loading board...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Edit Board
          </h1>

          <p className="mt-2 text-gray-600">
            Update board information
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-semibold text-gray-900"
            >
              Board Name
            </label>

            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-600 outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-semibold text-gray-900"
            >
              Description
            </label>

            <textarea
              id="description"
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              rows={4}
              className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-600 outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="startDate"
                className="mb-2 block text-sm font-semibold text-gray-900"
              >
                Start Date
              </label>

              <input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) =>
                  setStartDate(e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-600 outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
              />
            </div>

            <div>
              <label
                htmlFor="finishDate"
                className="mb-2 block text-sm font-semibold text-gray-900"
              >
                Finish Date
              </label>

              <input
                id="finishDate"
                type="date"
                value={finishDate}
                onChange={(e) =>
                  setFinishDate(e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-600 outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-lg bg-gray-900 px-4 py-3 font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? 'Updating...' : 'Update Board'}
          </button>
        </form>
      </div>
    </div>
  );
}