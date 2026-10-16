import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

const spinnerVariants = cva('animate-spin rounded-full border-2 border-current border-t-transparent', {
  variants: {
    size: {
      sm: 'h-4 w-4',
      default: 'h-6 w-6',
      lg: 'h-8 w-8',
      xl: 'h-12 w-12',
    },
    variant: {
      default: 'text-brand-600',
      light: 'text-white',
      dark: 'text-gray-900',
    },
  },
  defaultVariants: {
    size: 'default',
    variant: 'default',
  },
});

export interface SpinnerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerVariants> {
  label?: string;
}

function Spinner({ className, size, variant, label, ...props }: SpinnerProps) {
  return (
    <div className="flex items-center gap-2" {...props}>
      <div
        className={cn(spinnerVariants({ size, variant }), className)}
        role="status"
        aria-label={label || 'Loading'}
      >
        <span className="sr-only">{label || 'Loading'}</span>
      </div>
      {label && <span className="text-sm text-gray-600">{label}</span>}
    </div>
  );
}

export { Spinner, spinnerVariants };
