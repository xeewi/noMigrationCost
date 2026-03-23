import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface ConsumingTeamsProps {
  value: number;
  onChange: (value: number) => void;
}

export function ConsumingTeams({ value, onChange }: ConsumingTeamsProps) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const parsed = parseInt(e.target.value, 10);
    if (!isNaN(parsed)) {
      onChange(parsed);
    }
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
    const parsed = parseInt(e.target.value, 10);
    if (isNaN(parsed)) {
      onChange(2);
    } else {
      onChange(Math.max(2, Math.min(10, parsed)));
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Consuming Teams</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <label className="text-sm font-normal text-foreground">
            Number of consuming teams
          </label>
          <Input
            type="number"
            min={2}
            max={10}
            step={1}
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-24"
          />
          <p className="text-xs text-muted-foreground">
            Teams sharing the same codebase
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
