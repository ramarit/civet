'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ProjectCard } from '@/components/projects/project-card'
import { CreateProjectModal } from '@/components/projects/create-project-modal'
import { Plus, Search } from 'lucide-react'

const projects = [
  {
    id: '1',
    name: 'Marketing Website',
    description: 'Main corporate website with product information',
    languages: ['en', 'es', 'fr', 'de', 'ja'],
    translations: 234,
    status: 'active' as const,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    name: 'E-commerce Platform',
    description: 'Online store for retail products',
    languages: ['en', 'es', 'fr', 'de', 'it', 'pt', 'zh', 'ja'],
    translations: 567,
    status: 'active' as const,
    createdAt: new Date('2023-12-15'),
  },
  {
    id: '3',
    name: 'Mobile App',
    description: 'iOS and Android application',
    languages: ['en', 'es', 'zh'],
    translations: 145,
    status: 'pending' as const,
    createdAt: new Date('2024-01-10'),
  },
]

export default function ProjectsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">
            Manage your translation projects and languages
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search projects..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No projects found</p>
        </div>
      )}

      <CreateProjectModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />
    </div>
  )
}
