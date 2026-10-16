'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { TranslationEditor } from '@/components/translations/translation-editor'
import { LanguageSelector } from '@/components/translations/language-selector'
import { ArrowLeft, Save } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function TranslationsPage({ params }: { params: { id: string } }) {
  const { toast } = useToast()
  const [sourceLanguage, setSourceLanguage] = useState('en')
  const [targetLanguage, setTargetLanguage] = useState('es')
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // TODO: Save translations via API
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: 'Success',
        description: 'Translations saved successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save translations',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/dashboard/projects/${params.id}`}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Translation Editor</h1>
            <p className="text-muted-foreground">
              Edit and manage your translations
            </p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <LanguageSelector
          label="Source Language"
          value={sourceLanguage}
          onChange={setSourceLanguage}
        />
        <LanguageSelector
          label="Target Language"
          value={targetLanguage}
          onChange={setTargetLanguage}
        />
      </div>

      <TranslationEditor
        projectId={params.id}
        sourceLanguage={sourceLanguage}
        targetLanguage={targetLanguage}
      />
    </div>
  )
}
