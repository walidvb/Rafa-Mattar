import * as React from 'react';

import { cn } from '../../lib/utils';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
}

export function Dialog({ open, onOpenChange, title, children }: DialogProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        aria-label="Close dialog"
        onClick={() => onOpenChange(false)}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        className={cn(
          'relative w-full max-w-md rounded-lg bg-neutral-800 p-4 font-body text-neutral-300 shadow-xl',
          '[&_label]:text-neutral-300',
          '[&_input]:border-neutral-600 [&_input]:bg-neutral-700 [&_input]:text-neutral-200 [&_input::placeholder]:text-neutral-500 [&_input]:ring-offset-neutral-800',
          '[&_textarea]:border-neutral-600 [&_textarea]:bg-neutral-700 [&_textarea]:text-neutral-200 [&_textarea::placeholder]:text-neutral-500 [&_textarea]:ring-offset-neutral-800',
          '[&_.dialog-btn-outline]:border-neutral-500 [&_.dialog-btn-outline]:bg-neutral-700 [&_.dialog-btn-outline]:text-neutral-200 [&_.dialog-btn-outline]:hover:bg-neutral-600',
          '[&_.dialog-btn-primary]:bg-neutral-600 [&_.dialog-btn-primary]:text-neutral-100 [&_.dialog-btn-primary]:hover:bg-neutral-500',
        )}
      >
        <h2 id="dialog-title" className="mb-4 text-lg font-medium text-neutral-300">
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
}
