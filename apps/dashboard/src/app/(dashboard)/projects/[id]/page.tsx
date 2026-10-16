import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, Edit, Globe, Settings } from 'lucide-react'

// Mock data - replace with actual API call
const getProject = (id: string) => {
  const projects = {
    '1': {
      id: '1',
      name: 'Marketing Website',
      description: 'Main corporate website with product information',
      url: 'https://example.com',
      languages: [
        { code: 'en', name: 'English', isDefault: true, progress: 100 },
        { code: 'es', name: 'Spanish', isDefault: false, progress: 85 },
        { code: 'fr', name: 'French', isDefault: false, progress: 92 },
        { code: 'de', name: 'German', isDefault: false, progress: 78 },
        { code: 'ja', name: 'Japanese', isDefault: false, progress: 60 },
      ],
      translations: 234,
      status: 'active' as const,
      createdAt: new Date('2024-01-01'),
    },
  }
  return projects[id as keyof typeof projects]
}

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const project = getProject(params.id)

  if (!project) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/projects">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
            <p className="text-muted-foreground">{project.description}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/projects/${project.id}/settings`}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/dashboard/projects/${project.id}/translations`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Translations
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Translations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{project.translations}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Languages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{project.languages.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className="text-lg">{project.status}</Badge>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="languages">
        <TabsList>
          <TabsTrigger value="languages">Languages</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
        </TabsList>
        <TabsContent value="languages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Supported Languages</CardTitle>
              <CardDescription>
                Manage translations for each language
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {project.languages.map((language) => (
                  <div
                    key={language.code}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <Globe className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{language.name}</span>
                          {language.isDefault && (
                            <Badge variant="secondary">Default</Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {language.code.toUpperCase()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-sm font-medium">{language.progress}%</div>
                        <div className="text-xs text-muted-foreground">Complete</div>
                      </div>
                      <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${language.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Website URL</div>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {project.url}
                </a>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Created</div>
                <div>{project.createdAt.toLocaleDateString()}</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
