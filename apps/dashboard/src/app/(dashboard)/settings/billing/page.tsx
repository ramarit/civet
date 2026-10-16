'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { Check, CreditCard, Download } from 'lucide-react'
import { cn } from '@/lib/utils'

const plans = [
  {
    name: 'Starter',
    price: '$29',
    period: '/month',
    description: 'Perfect for small projects',
    features: [
      'Up to 3 projects',
      '5 languages per project',
      '1,000 translations/month',
      'Basic support',
    ],
    current: false,
  },
  {
    name: 'Professional',
    price: '$99',
    period: '/month',
    description: 'For growing businesses',
    features: [
      'Up to 10 projects',
      'Unlimited languages',
      '10,000 translations/month',
      'Priority support',
      'Team collaboration',
      'API access',
    ],
    current: true,
  },
  {
    name: 'Enterprise',
    price: '$299',
    period: '/month',
    description: 'For large organizations',
    features: [
      'Unlimited projects',
      'Unlimited languages',
      'Unlimited translations',
      '24/7 Premium support',
      'Advanced team features',
      'Custom integrations',
      'SLA guarantee',
    ],
    current: false,
  },
]

const invoices = [
  {
    id: 'INV-001',
    date: '2024-01-01',
    amount: '$99.00',
    status: 'paid',
  },
  {
    id: 'INV-002',
    date: '2023-12-01',
    amount: '$99.00',
    status: 'paid',
  },
  {
    id: 'INV-003',
    date: '2023-11-01',
    amount: '$99.00',
    status: 'paid',
  },
]

export default function BillingPage() {
  const { toast } = useToast()

  const handleUpgrade = (planName: string) => {
    toast({
      title: 'Upgrade initiated',
      description: `Upgrading to ${planName} plan...`,
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Billing & Plans</h1>
        <p className="text-muted-foreground">Manage your subscription and billing information</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={cn(
              plan.current && 'border-primary shadow-lg'
            )}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{plan.name}</CardTitle>
                {plan.current && <Badge>Current Plan</Badge>}
              </div>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>
              <ul className="space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center text-sm">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                variant={plan.current ? 'outline' : 'default'}
                disabled={plan.current}
                onClick={() => handleUpgrade(plan.name)}
              >
                {plan.current ? 'Current Plan' : 'Upgrade'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
          <CardDescription>Manage your payment information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Visa ending in 4242</p>
                <p className="text-sm text-muted-foreground">Expires 12/2025</p>
              </div>
            </div>
            <Button variant="outline">Update</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>Download your previous invoices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <p className="font-medium">{invoice.id}</p>
                  <p className="text-sm text-muted-foreground">{invoice.date}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="font-medium">{invoice.amount}</p>
                    <Badge variant="outline">{invoice.status}</Badge>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
