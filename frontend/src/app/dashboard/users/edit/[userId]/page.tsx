'use client';

import Image from 'next/image';
import { callApis } from '@/apis/callApi';
import { sendGetRequest } from '@/apis/getRequest';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type User = {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'MEMBER';
  image?: string | null;
};

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();

  const userId = params.userId as string;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'ADMIN' | 'MEMBER'>('MEMBER');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      try {
        const data: User = await sendGetRequest(
          `/users/${userId}`,
          'EditUserPage',
          {
            requiredAuth: true,
          },
        );

        setName(data.name);
        setEmail(data.email);
        setRole(data.role);

        if (data.image) {
          setImagePreview(data.image);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [userId]);

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (
    e: React.SyntheticEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    try {
      setSaving(true);

      await callApis(`/users/${userId}`, 'EditUserPage', {
        method: 'PATCH',
        body: {
          name,
          email,
          role,
          image: image?.name || undefined,
        },
        requiredAuth: true,
      });

      router.push('/dashboard/users');
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <p className="text-gray-700">Loading user...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Edit User
          </h1>

          <p className="mt-2 text-base text-gray-600">
            Update user information
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-semibold text-gray-900"
            >
              Name
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
              htmlFor="email"
              className="mb-2 block text-sm font-semibold text-gray-900"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-600 outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
            />
          </div>

          <div>
            <label
              htmlFor="role"
              className="mb-2 block text-sm font-semibold text-gray-900"
            >
              Role
            </label>

            <select
              id="role"
              value={role}
              onChange={(e) =>
                setRole(e.target.value as 'ADMIN' | 'MEMBER')
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-600 outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
            >
              <option value="MEMBER">MEMBER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="image"
              className="mb-2 block text-sm font-semibold text-gray-900"
            >
              Profile Image
              <span className="ml-1 font-normal text-gray-500">
                (optional)
              </span>
            </label>

            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-600 file:mr-4 file:rounded-md file:border-0 file:bg-gray-900 file:px-4 file:py-2 file:font-medium file:text-white hover:file:bg-gray-800"
            />

            {imagePreview && (
              <div className="mt-5 flex flex-col items-center">
                <div className="overflow-hidden rounded-full border-4 border-gray-200">
                  <Image
                    src={imagePreview}
                    alt="Profile preview"
                    width={120}
                    height={120}
                    className="h-30 w-30 object-cover"
                    unoptimized
                  />
                </div>

                {image && (
                  <p className="mt-2 text-sm text-gray-600">
                    {image.name}
                  </p>
                )}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-lg bg-gray-900 px-4 py-3 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? 'Updating...' : 'Update User'}
          </button>
        </form>
      </div>
    </div>
  );
}