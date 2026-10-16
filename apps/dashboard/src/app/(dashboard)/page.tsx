import { StatsCard } from '@/components/shared/stats-card'
import { RecentActivity } from '@/components/dashboard/recent-activity'
import { ProjectsOverview } from '@/components/dashboard/projects-overview'
import { TranslationStats } from '@/components/dashboard/translation-stats'
import { Users, Globe, FileText, TrendingUp } from 'lucide-react'

export default function DashboardPage() {
  // TODO: Fetch real data from API
  const stats = [
    {
      title: 'Total Projects',
      value: '12',
      change: '+2 from last month',
      trend: 'up' as const,
      icon: FileText,
    },
    {
      title: 'Active Languages',
      value: '24',
      change: '+4 from last month',
      trend: 'up' as const,
      icon: Globe,
    },
    {
      title: 'Translations',
      value: '1,429',
      change: '+201 from last month',
      trend: 'up' as const,
      icon: TrendingUp,
    },
    {
      title: 'Team Members',
      value: '8',
      change: '+1 from last month',
      trend: 'up' as const,
      icon: Users,
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your translation projects.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <TranslationStats />
        <RecentActivity />
      </div>

      <ProjectsOverview />
    </div>
  )
}
