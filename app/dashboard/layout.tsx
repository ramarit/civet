import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";
import { InboxIcon } from "@heroicons/react/24/outline";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  // For testing: allow access without login
  const displayUser = user || {
    name: "Test User",
    email: "test@example.com",
  };

  // Commented out for testing
  // if (!user) {
  //   redirect("/login");
  // }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center h-16 px-6 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-900">Civet</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            <NavLink href="/dashboard" icon="📊">
              Dashboard
            </NavLink>
            <NavLink href="/dashboard/pages" icon="📄">
              Pages
            </NavLink>
            <NavLink href="/dashboard/forms" icon="📝">
              Forms
            </NavLink>
            <NavLink href="/dashboard/inbox">
              <InboxIcon className="h-5 w-5 mr-3" />
              Inbox
            </NavLink>
            <NavLink href="/dashboard/analytics" icon="📈">
              Analytics
            </NavLink>
          </nav>

          {/* User info */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                {displayUser.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {displayUser.name}
                </p>
                <p className="text-xs text-gray-500 truncate">{displayUser.email}</p>
              </div>
            </div>
            <div className="mt-3">
              <a
                href="/api/auth/logout"
                className="block w-full text-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Sign out
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="pl-64">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  Welcome back, {displayUser.name.split(" ")[0]}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Manage your{" "}
                  <Link
                    href="/dashboard/pages"
                    className="text-blue-600 hover:underline"
                  >
                    landing pages
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}

function NavLink({
  href,
  icon,
  children,
}: {
  href: string;
  icon?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900"
    >
      {icon && <span className="mr-3 text-lg">{icon}</span>}
      {children}
    </Link>
  );
}
