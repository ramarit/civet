'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Icons } from '@/components/ui/icons'
import {
  LayoutDashboard,
  FolderOpen,
  BarChart3,
  Settings,
  Users,
  CreditCard,
  User
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Projects', href: '/dashboard/projects', icon: FolderOpen },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings, children: [
    { name: 'Profile', href: '/dashboard/settings/profile', icon: User },
    { name: 'Team', href: '/dashboard/settings/team', icon: Users },
    { name: 'Billing', href: '/dashboard/settings/billing', icon: CreditCard },
  ]},
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="flex items-center h-16 px-6 border-b border-gray-200 dark:border-gray-700">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <Icons.logo className="h-8 w-8" />
          <span className="text-xl font-bold">Civet</span>
        </Link>
      </div>
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          const Icon = item.icon

          return (
            <div key={item.name}>
              <Link
                href={item.href}
                className={cn(
                  'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                )}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
              {item.children && isActive && (
                <div className="ml-8 mt-1 space-y-1">
                  {item.children.map((child) => {
                    const isChildActive = pathname === child.href
                    const ChildIcon = child.icon

                    return (
                      <Link
                        key={child.name}
                        href={child.href}
                        className={cn(
                          'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                          isChildActive
                            ? 'bg-primary/10 text-primary'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                        )}
                      >
                        <ChildIcon className="mr-3 h-4 w-4" />
                        {child.name}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>
    </aside>
  )
}
