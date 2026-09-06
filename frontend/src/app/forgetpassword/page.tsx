'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { callApis } from '@/apis/callApi';

export default function ForgetPassword() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    e: React.SyntheticEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError('');
      setMessage('');

      await callApis(
        '/auth/forgot-password',
        'ForgetPasswordPage',
        {
          method: 'POST',
          body: {
            email,
          },
          requiredAuth: false,
        },
      );

      setMessage(
        'If an account exists with this email, a password reset link has been sent.',
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please try again.',
      );
    } finally {
      setLoading(false);
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
            Forgot Password
          </h1>

          <p className="mt-1 text-sm text-gray-600">
            Enter your email address and we&apos;ll send you a
            password reset link.
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
            placeholder="you@gmail.com"
            required
          />
        </div>

        {error && (
          <p className="text-sm text-red-600">
            {error}
          </p>
        )}

        {message && (
          <p className="text-sm text-green-600">
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-gray-900 p-2.5 font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? 'Sending...'
            : 'Send Reset Link'}
        </button>

        <div className="text-center">
          <Link
            href="/"
            className="text-sm font-medium text-gray-700 hover:text-gray-900 hover:underline"
          >
            Back to Login
          </Link>
        </div>
      </form>
    </main>
  );
}