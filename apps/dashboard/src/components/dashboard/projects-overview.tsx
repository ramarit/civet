'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Globe } from 'lucide-react'

const projects = [
  {
    id: 1,
    name: 'Marketing Website',
    languages: 5,
    translations: 234,
    status: 'active' as const,
  },
  {
    id: 2,
    name: 'E-commerce Platform',
    languages: 8,
    translations: 567,
    status: 'active' as const,
  },
  {
    id: 3,
    name: 'Mobile App',
    languages: 3,
    translations: 145,
    status: 'pending' as const,
  },
]

export function ProjectsOverview() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Projects</CardTitle>
          <CardDescription>Manage your translation projects</CardDescription>
        </div>
        <Button asChild>
          <Link href="/dashboard/projects">View All</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Globe className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium">{project.name}</h4>
                    <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
                      {project.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {project.languages} languages • {project.translations} translations
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" asChild>
                <Link href={`/dashboard/projects/${project.id}`}>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
