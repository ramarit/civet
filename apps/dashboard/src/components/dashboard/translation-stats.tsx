'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { name: 'Mon', translations: 45 },
  { name: 'Tue', translations: 52 },
  { name: 'Wed', translations: 38 },
  { name: 'Thu', translations: 65 },
  { name: 'Fri', translations: 58 },
  { name: 'Sat', translations: 32 },
  { name: 'Sun', translations: 28 },
]

export function TranslationStats() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Translations</CardTitle>
        <CardDescription>Translation activity over the past week</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="name" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px',
              }}
            />
            <Bar dataKey="translations" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
