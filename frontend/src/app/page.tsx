'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { callApis } from '@/apis/callApi';


export default function Home() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (
    e: React.SyntheticEvent,
  ) => {
    e.preventDefault();

    try {
      setError('');

      const data = await callApis(
        '/auth/login',
        'LoginComponent',
        {
          method: 'POST',
          body: {
            email,
            password,
          },
          requiredAuth: false,
        },
      );

      const storeData= {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      }
      // console.log('Storing auth data in localStorage:', storeData);

      const stringifiedData = JSON.stringify(storeData);
      // console.log('Stringified auth data:', stringifiedData);

      localStorage.setItem('webBriksAuth', stringifiedData);

      router.push('/dashboard');
    } catch {
      setError('Invalid email or password');
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-5 rounded-lg border border-gray-300 bg-white p-8 shadow-sm"
      >
        <div className="border-b border-gray-200 pb-5">
          <h1 className="text-2xl font-bold text-gray-900">
            Web Briks
          </h1>

          <p className="mt-1 text-sm text-gray-600">
            Sign in to your account
          </p>
        </div>

        <div>
          <label
            htmlFor="email"
            className="mb-1 block text-sm font-medium text-gray-900"
          >
            Email
          </label>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-gray-300 p-2.5 text-gray-900 outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
            placeholder="admin@example.com"
            required
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-1 block text-sm font-medium text-gray-900"
          >
            Password
          </label>

          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-gray-300 p-2.5 text-gray-900 outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
            placeholder="••••••••"
            required
          />
        </div>

        {error && (
          <p className="text-sm text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="w-full rounded-lg bg-gray-900 p-2.5 font-medium text-white hover:bg-gray-800"
        >
          Login
        </button>
      </form>
    </main>
  );
}