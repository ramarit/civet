import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Globe, FileText, ArrowRight } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface ProjectCardProps {
  project: {
    id: string
    name: string
    description: string
    languages: string[]
    translations: number
    status: 'active' | 'pending' | 'archived'
    createdAt: Date
  }
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="line-clamp-1">{project.name}</CardTitle>
            <CardDescription className="line-clamp-2 mt-1">
              {project.description}
            </CardDescription>
          </div>
          <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
            {project.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-muted-foreground">
            <Globe className="mr-2 h-4 w-4" />
            {project.languages.length} languages
          </div>
          <div className="flex items-center text-muted-foreground">
            <FileText className="mr-2 h-4 w-4" />
            {project.translations} translations
          </div>
        </div>
        <div className="text-xs text-muted-foreground">
          Created {formatDate(project.createdAt)}
        </div>
        <div className="flex space-x-2">
          <Button asChild variant="default" size="sm" className="flex-1">
            <Link href={`/dashboard/projects/${project.id}`}>
              View Project
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="flex-1">
            <Link href={`/dashboard/projects/${project.id}/translations`}>
              Edit Translations
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
