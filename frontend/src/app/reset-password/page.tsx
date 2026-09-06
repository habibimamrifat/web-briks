
'use client';

import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { callApis } from '@/apis/callApi';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    e: React.SyntheticEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    setError('');
    setMessage('');

    if (!token) {
      setError('Invalid or missing reset token.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);

      await callApis('/auth/reset-password', 'ResetPasswordPage', {
        method: 'POST',
        body: {
          token,
          password,
        },
        requiredAuth: false,
      });

      setMessage(
        'Password reset successfully. Redirecting to login...',
      );

      setPassword('');
      setConfirmPassword('');

      setTimeout(() => {
        router.push('/');
      }, 1500);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Failed to reset password.',
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
            Reset Password
          </h1>

          <p className="mt-1 text-sm text-gray-600">
            Enter your new password below.
          </p>
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-1 block text-sm font-medium text-gray-900"
          >
            New Password
          </label>

          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-gray-300 p-2.5 text-gray-900 outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
            placeholder="••••••••"
            minLength={6}
            required
          />
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-1 block text-sm font-medium text-gray-900"
          >
            Confirm Password
          </label>

          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-lg border border-gray-300 p-2.5 text-gray-900 outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
            placeholder="••••••••"
            minLength={6}
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
          disabled={loading || !token}
          className="w-full rounded-lg bg-gray-900 p-2.5 font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Resetting...' : 'Reset Password'}
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

export default function ResetPassword() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
