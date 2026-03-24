import { useState } from 'react';
import { Link, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import type { View } from '@/hooks/useHashRoute';
import { cn } from '@/lib/utils';

interface AppHeaderProps {
  onReset: () => void;
  view: View;
  onNavigate: (target: View) => void;
}

export function AppHeader({ onReset, view, onNavigate }: AppHeaderProps) {
  const [copied, setCopied] = useState<boolean>(false);

  function handleCopyLink() {
    try {
      navigator.clipboard.writeText(window.location.href).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    } catch {
      // Silent fail per UI-SPEC copywriting contract
    }
  }

  return (
    <header className="border-b border-border">
      <div className="max-w-[1280px] mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-foreground">Feature Cost Calculator</h1>
          <nav className="flex items-center gap-1" aria-label="Main navigation">
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); onNavigate('calculator'); }}
              className={cn(
                "text-sm px-2 py-1 rounded transition-colors",
                view === 'calculator'
                  ? "text-foreground underline underline-offset-4 decoration-1"
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-current={view === 'calculator' ? 'page' : undefined}
            >
              Calculator
            </a>
            <a
              href="#/docs"
              onClick={(e) => { e.preventDefault(); onNavigate('docs'); }}
              className={cn(
                "text-sm px-2 py-1 rounded transition-colors",
                view === 'docs'
                  ? "text-foreground underline underline-offset-4 decoration-1"
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-current={view === 'docs' ? 'page' : undefined}
            >
              Documentation
            </a>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          {/* Copy Link button — always visible per D-04 */}
          <Button variant="default" size="sm" onClick={handleCopyLink}>
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Link className="h-4 w-4" />
            )}
            {copied ? 'Copied!' : 'Copy Link'}
          </Button>

          {/* Reset All — only on calculator view per D-03 */}
          {view === 'calculator' && (
            <AlertDialog>
              <AlertDialogTrigger render={<Button variant="outline" size="sm" />}>
                Reset All
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reset all inputs?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will clear your entire scenario. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep Inputs</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={onReset}
                    className="bg-destructive text-white hover:bg-destructive/90"
                  >
                    Reset All
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>
    </header>
  );
}
