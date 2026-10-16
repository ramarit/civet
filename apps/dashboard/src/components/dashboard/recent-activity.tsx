'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatDate } from '@/lib/utils'

const activities = [
  {
    id: 1,
    user: 'John Doe',
    avatar: '',
    action: 'Updated translations for',
    project: 'Marketing Website',
    timestamp: new Date('2024-01-15T10:30:00'),
  },
  {
    id: 2,
    user: 'Jane Smith',
    avatar: '',
    action: 'Added new language',
    project: 'E-commerce Platform',
    timestamp: new Date('2024-01-15T09:15:00'),
  },
  {
    id: 3,
    user: 'Bob Johnson',
    avatar: '',
    action: 'Completed review for',
    project: 'Blog',
    timestamp: new Date('2024-01-14T16:45:00'),
  },
]

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest updates from your team</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-4">
              <Avatar className="h-9 w-9">
                <AvatarImage src={activity.avatar} alt={activity.user} />
                <AvatarFallback>
                  {activity.user
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <p className="text-sm">
                  <span className="font-medium">{activity.user}</span>{' '}
                  <span className="text-muted-foreground">{activity.action}</span>{' '}
                  <span className="font-medium">{activity.project}</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(activity.timestamp)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
