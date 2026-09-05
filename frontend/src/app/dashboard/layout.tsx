import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import LogoutButton from "@/components/LogOutButton";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProtectedRoute>
      <div className="flex h-screen w-screen overflow-hidden bg-gray-100">
        <aside className="flex h-full w-64 shrink-0 flex-col bg-gray-900 text-white">
          <div className="border-b border-gray-700 p-6">
            <h1 className="text-xl font-bold">
              Web Briks
            </h1>
          </div>

          <nav className="flex-1 space-y-2 overflow-y-auto p-4">
            <Link
              href="/dashboard"
              className="block rounded-lg px-4 py-3 hover:bg-gray-800"
            >
              Dashboard
            </Link>

            <Link
              href="/dashboard/users"
              className="block rounded-lg px-4 py-3 hover:bg-gray-800"
            >
              Users
            </Link>

            <Link
              href="/dashboard/boards"
              className="block rounded-lg px-4 py-3 hover:bg-gray-800"
            >
              Boards
            </Link>

            <Link
              href="/dashboard/me"
              className="block rounded-lg px-4 py-3 hover:bg-gray-800"
            >
              My Profile
            </Link>
          </nav>

          <div className="shrink-0 border-t border-gray-700 p-4 text-red-400">
            <LogoutButton />
          </div>
        </aside>

        <main className="min-w-0 flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}