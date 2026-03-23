import { cn } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface TimeHorizonProps {
  horizonYears: number;
  onHorizonChange: (years: number) => void;
}

const HORIZON_OPTIONS = [1, 3, 5, 10] as const;

function formatYearLabel(years: number): string {
  return years === 1 ? '1 yr' : `${years} yrs`;
}

export function TimeHorizon({ horizonYears, onHorizonChange }: TimeHorizonProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Time Horizon</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <span className="text-sm font-medium text-foreground">
            Projection horizon
          </span>
          <div className="flex gap-2">
            {HORIZON_OPTIONS.map((years) => (
              <Button
                key={years}
                variant={horizonYears === years ? 'default' : 'outline'}
                onClick={() => onHorizonChange(years)}
                type="button"
                className={cn('min-w-[60px]')}
              >
                {formatYearLabel(years)}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
