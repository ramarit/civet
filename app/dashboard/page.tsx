import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Overview of your landing pages and leads
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Total Pages"
          value="0"
          icon="📄"
          href="/dashboard/pages"
        />
        <StatCard
          title="Total Forms"
          value="0"
          icon="📝"
          href="/dashboard/forms"
        />
        <StatCard
          title="Total Leads"
          value="0"
          icon="👥"
          href="/dashboard/leads"
        />
        <StatCard
          title="Avg. Lead Score"
          value="0"
          icon="⭐"
          href="/dashboard/leads"
        />
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/dashboard/pages/create"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <span className="text-2xl mr-3">📄</span>
            <div>
              <h3 className="font-medium text-gray-900">Create Page</h3>
              <p className="text-sm text-gray-500">Build a new landing page</p>
            </div>
          </Link>

          <Link
            href="/dashboard/forms/create"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <span className="text-2xl mr-3">📝</span>
            <div>
              <h3 className="font-medium text-gray-900">Create Form</h3>
              <p className="text-sm text-gray-500">Build an intake form</p>
            </div>
          </Link>

          <Link
            href="/dashboard/leads"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <span className="text-2xl mr-3">👥</span>
            <div>
              <h3 className="font-medium text-gray-900">View Leads</h3>
              <p className="text-sm text-gray-500">Manage your leads</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent activity placeholder */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Activity
        </h2>
        <p className="text-gray-500 text-center py-8">
          No recent activity yet. Create your first page to get started!
        </p>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  href,
}: {
  title: string;
  value: string;
  icon: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <span className="text-4xl">{icon}</span>
      </div>
    </Link>
  );
}
