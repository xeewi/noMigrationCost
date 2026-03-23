import { cn, formatEuro } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import type { SeniorityLevel, SeniorityRow } from '@/engine/types';
import { SENIORITY_DEFAULTS } from '@/engine/types';

interface TeamCompositionProps {
  team: SeniorityRow[];
  onTeamChange: (team: SeniorityRow[]) => void;
  teamAvgRate: number;
}

const SENIORITY_LEVELS: SeniorityLevel[] = ['Junior', 'Mid', 'Senior', 'Lead'];

export function TeamComposition({ team, onTeamChange, teamAvgRate }: TeamCompositionProps) {
  function handleHeadcountChange(index: number, value: string) {
    const parsed = parseInt(value, 10);
    const headcount = isNaN(parsed) || parsed < 0 ? 0 : parsed;
    const updated = team.map((row, i) =>
      i === index ? { ...row, headcount } : row
    );
    onTeamChange(updated);
  }

  function handleRateChange(index: number, value: string) {
    const parsed = parseFloat(value);
    const hourlyRate = isNaN(parsed) || parsed < 0 ? SENIORITY_DEFAULTS[team[index].label] : parsed;
    const updated = team.map((row, i) =>
      i === index ? { ...row, hourlyRate } : row
    );
    onTeamChange(updated);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Team Composition</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]"></TableHead>
              <TableHead className="w-[30%]">Count</TableHead>
              <TableHead className="w-[30%]">€/h</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {SENIORITY_LEVELS.map((level, index) => {
              const row = team[index];
              return (
                <TableRow key={level}>
                  <TableCell className="font-medium">{level}</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min={0}
                      className="w-20"
                      value={row.headcount === 0 ? '' : row.headcount}
                      placeholder="0"
                      aria-label={`${level} headcount`}
                      onChange={(e) => handleHeadcountChange(index, e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min={0}
                      className="w-24"
                      value={row.hourlyRate}
                      aria-label={`${level} hourly rate`}
                      onChange={(e) => handleRateChange(index, e.target.value)}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <div className={cn('mt-4 flex items-baseline gap-2 text-sm')}>
          <span className="text-muted-foreground font-medium">
            Team average loaded hourly cost
          </span>
          <span className="font-semibold text-foreground">
            {teamAvgRate > 0 ? `${formatEuro(teamAvgRate)}/h` : '\u2014'}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
