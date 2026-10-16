import { LucideIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface StatsCardProps {
  title: string
  value: string | number
  change?: string
  trend?: 'up' | 'down'
  icon: LucideIcon
}

export function StatsCard({ title, value, change, trend, icon: Icon }: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <p
            className={cn(
              'text-xs',
              trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            )}
          >
            {change}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
