import Link from 'next/link';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-gray-900 text-white">
        <div className="border-b border-gray-700 p-6">
          <h1 className="text-xl font-bold">Web Briks</h1>
        </div>

        <nav className="space-y-2 p-4">
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
        </nav>
      </aside>

      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}

