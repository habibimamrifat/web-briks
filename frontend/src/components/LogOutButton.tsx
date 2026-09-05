"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("webBriksAuth");

    router.replace("/");
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="block w-full rounded-lg px-4 py-3 text-left text-red-400 hover:bg-gray-800 hover:text-red-300"
    >
      Logout
    </button>
  );
}