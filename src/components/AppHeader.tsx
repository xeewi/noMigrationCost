/**
 * @file AppHeader.tsx
 * @author Guillaume Gautier (xeewi)
 * @created 2026-03-24
 * @project Feature Cost Calculator
 */

import { useState } from 'react';
import { Link, Check, RotateCcw } from 'lucide-react';
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

  const navLink = (active: boolean) =>
    cn(
      'px-0.5 py-1 text-[13px] sm:text-sm font-medium whitespace-nowrap transition-colors border-b-2',
      active ? 'text-white border-signal' : 'text-[#b9bec8] border-transparent hover:text-white',
    );

  return (
    <header className="sticky top-0 z-50 bg-ink text-white">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-2 sm:gap-4">
        <div className="flex items-center gap-2.5 sm:gap-7 min-w-0">
          <h1 className="flex items-center gap-2 font-sign text-[16px] sm:text-[20px] font-extrabold uppercase tracking-[0.03em] whitespace-nowrap">
            <svg viewBox="0 0 24 22" className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" aria-hidden="true">
              <path d="M12 1 23 21H1Z" fill="var(--signal)" stroke="var(--ink)" strokeWidth="1.5" strokeLinejoin="round" />
              <rect x="11" y="8" width="2" height="7" fill="var(--ink)" />
              <rect x="11" y="16.5" width="2" height="2" fill="var(--ink)" />
            </svg>
            <span>Feature Cost</span>
          </h1>
          <nav className="flex items-center gap-2.5 sm:gap-4" aria-label="Main navigation">
            <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('calculator'); }}
              className={navLink(view === 'calculator')} aria-current={view === 'calculator' ? 'page' : undefined}>
              Calculator
            </a>
            <a href="#/docs" onClick={(e) => { e.preventDefault(); onNavigate('docs'); }}
              className={navLink(view === 'docs')} aria-current={view === 'docs' ? 'page' : undefined}>
              How it works
            </a>
          </nav>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          {view === 'calculator' && (
            <AlertDialog>
              <AlertDialogTrigger render={<button type="button" className="inline-flex h-8 items-center gap-1.5 rounded-sm border border-white/25 px-2 sm:px-3 text-sm font-medium text-white hover:bg-white/10" aria-label="Start over" />}>
                <RotateCcw className="h-4 w-4" /><span className="hidden sm:inline">Start over</span>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Go back to the example scenario?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Your current figures will be replaced by the example. Copy the link first if you want to keep them.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep my figures</AlertDialogCancel>
                  <AlertDialogAction onClick={onReset} className="bg-ink text-white hover:bg-ink/90">
                    Start over
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          <button type="button" onClick={handleCopyLink}
            aria-label={copied ? 'Link copied' : 'Copy link'}
            className="inline-flex h-8 items-center gap-1.5 rounded-sm bg-signal px-2 sm:px-3 text-sm font-semibold text-ink hover:bg-[#ffd633]">
            {copied ? <Check className="h-4 w-4" /> : <Link className="h-4 w-4" />}
            <span className="hidden sm:inline">{copied ? 'Link copied' : 'Copy link'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
