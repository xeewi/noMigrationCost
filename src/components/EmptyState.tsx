/**
 * @file EmptyState.tsx
 * @author Guillaume Gautier (xeewi)
 * @created 2026-03-24
 * @project Feature Cost Calculator
 */

import type { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12 gap-4 text-center">
        <Icon className="w-12 h-12 text-muted-foreground" />
        <div className="space-y-2 flex flex-col items-center">
          <p className="text-xl font-semibold text-center">{title}</p>
          <p className="text-sm text-muted-foreground max-w-sm text-center">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
