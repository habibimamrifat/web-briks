"use client";

import { useState } from "react";
import { login } from "@/lib/auth";
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    try {
      setError("");

      const data = await login(email, password);
      console.log(data);
      const authData = {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      };
      localStorage.setItem("webBriksAuth", JSON.stringify(authData));
      router.push('/dashboard');

    } catch {
      setError("Invalid email or password");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-4 rounded-lg border p-8"
      >
        <h1 className="text-2xl font-bold">Web Briks</h1>

        <div>
          <label htmlFor="email" className="mb-1 block">
            Email
          </label>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded border p-2"
            placeholder="admin@example.com"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1 block">
            Password
          </label>

          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded border p-2"
            placeholder="••••••••"
            required
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          className="w-full rounded bg-black p-2 text-white"
        >
          Login
        </button>
      </form>
    </main>
  );
}
