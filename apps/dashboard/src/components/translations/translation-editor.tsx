'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, X, Edit2 } from 'lucide-react'

interface Translation {
  id: string
  key: string
  source: string
  target: string
  context?: string
  status: 'translated' | 'pending' | 'needs-review'
}

interface TranslationEditorProps {
  projectId: string
  sourceLanguage: string
  targetLanguage: string
}

// Mock data - replace with actual API call
const mockTranslations: Translation[] = [
  {
    id: '1',
    key: 'home.title',
    source: 'Welcome to Our Platform',
    target: 'Bienvenido a Nuestra Plataforma',
    context: 'Homepage hero title',
    status: 'translated',
  },
  {
    id: '2',
    key: 'home.subtitle',
    source: 'Discover amazing features',
    target: 'Descubre características increíbles',
    context: 'Homepage hero subtitle',
    status: 'translated',
  },
  {
    id: '3',
    key: 'nav.products',
    source: 'Products',
    target: '',
    context: 'Navigation menu',
    status: 'pending',
  },
  {
    id: '4',
    key: 'nav.pricing',
    source: 'Pricing',
    target: 'Precios',
    context: 'Navigation menu',
    status: 'needs-review',
  },
]

export function TranslationEditor({
  projectId,
  sourceLanguage,
  targetLanguage,
}: TranslationEditorProps) {
  const [translations, setTranslations] = useState<Translation[]>(mockTranslations)
  const [editingId, setEditingId] = useState<string | null>(null)

  const handleEdit = (id: string, value: string) => {
    setTranslations((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              target: value,
              status: value ? 'translated' : 'pending',
            }
          : t
      )
    )
  }

  const getStatusColor = (status: Translation['status']) => {
    switch (status) {
      case 'translated':
        return 'default'
      case 'pending':
        return 'destructive'
      case 'needs-review':
        return 'secondary'
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Translations</CardTitle>
          <CardDescription>
            Translating from {sourceLanguage.toUpperCase()} to {targetLanguage.toUpperCase()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {translations.map((translation) => (
              <div
                key={translation.id}
                className="border rounded-lg p-4 space-y-3 hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center space-x-2">
                      <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                        {translation.key}
                      </code>
                      <Badge variant={getStatusColor(translation.status)}>
                        {translation.status}
                      </Badge>
                    </div>
                    {translation.context && (
                      <p className="text-xs text-muted-foreground">{translation.context}</p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      setEditingId(editingId === translation.id ? null : translation.id)
                    }
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">
                      Source ({sourceLanguage.toUpperCase()})
                    </label>
                    <div className="text-sm p-2 bg-muted rounded">{translation.source}</div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">
                      Translation ({targetLanguage.toUpperCase()})
                    </label>
                    {editingId === translation.id ? (
                      <div className="flex space-x-2">
                        <Input
                          value={translation.target}
                          onChange={(e) => handleEdit(translation.id, e.target.value)}
                          placeholder="Enter translation..."
                          autoFocus
                        />
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setEditingId(null)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div
                        className="text-sm p-2 bg-muted rounded cursor-pointer hover:bg-accent"
                        onClick={() => setEditingId(translation.id)}
                      >
                        {translation.target || (
                          <span className="text-muted-foreground italic">
                            Click to add translation...
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
