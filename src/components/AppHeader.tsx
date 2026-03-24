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

interface AppHeaderProps {
  onReset: () => void;
}

export function AppHeader({ onReset }: AppHeaderProps) {
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
        <h1 className="text-xl font-semibold text-foreground">Feature Cost Calculator</h1>
        <div className="flex items-center gap-2">
          <Button variant="default" size="sm" onClick={handleCopyLink}>
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Link className="h-4 w-4" />
            )}
            {copied ? 'Copied!' : 'Copy Link'}
          </Button>
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
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={onReset}
                  className="bg-destructive text-white hover:bg-destructive/90"
                >
                  Reset All
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </header>
  );
}
