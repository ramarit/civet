'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Icons } from '@/components/ui/icons'
import { cn } from '@/lib/utils'
import {
  Menu,
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
  { name: 'Profile', href: '/dashboard/settings/profile', icon: User },
  { name: 'Team', href: '/dashboard/settings/team', icon: Users },
  { name: 'Billing', href: '/dashboard/settings/billing', icon: CreditCard },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="lg:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex items-center h-16 px-6 border-b">
            <Link href="/dashboard" className="flex items-center space-x-2" onClick={() => setOpen(false)}>
              <Icons.logo className="h-8 w-8" />
              <span className="text-xl font-bold">Civet</span>
            </Link>
          </div>
          <nav className="px-4 py-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              const Icon = item.icon

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setOpen(false)}
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
              )
            })}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  )
}
