import type { ReactNode } from 'react';

import LanguageToggle from './LanguageToggle';

export interface ScreenShellProps {
  children: ReactNode;
  eyebrow?: string;
  title?: string;
  description?: string;
  showLanguageToggle?: boolean;
  footer?: ReactNode;
}

/**
 * Mobile-first full-bleed layout used by every customer flow screen.
 * Applies the brand typography rules — Bebas Neue for titles, DM Sans for
 * body, eyebrow tag for the section label.
 */
export default function ScreenShell({
  children,
  eyebrow,
  title,
  description,
  showLanguageToggle = true,
  footer,
}: ScreenShellProps): JSX.Element {
  return (
    <div className="min-h-full bg-canvas-bg">
      <header className="flex items-center justify-between px-6 pt-6 pb-2">
        <div
          className="font-display text-[20px] tracking-[4px] text-obsidian"
          aria-label="Kayan"
        >
          KAYAN
        </div>
        {showLanguageToggle ? <LanguageToggle /> : <span />}
      </header>

      <main className="mx-auto flex w-full max-w-md flex-col px-6 pb-12 pt-8">
        {eyebrow ? (
          <p className="eyebrow text-obsidian/70">{eyebrow}</p>
        ) : null}
        {title ? (
          <h1 className="mt-3 font-display text-display-md text-obsidian">
            {title}
          </h1>
        ) : null}
        {description ? (
          <p className="mt-3 font-sans text-[14px] leading-[1.6] text-obsidian/70">
            {description}
          </p>
        ) : null}

        <div className="mt-8">{children}</div>
      </main>

      {footer ? (
        <footer className="mx-auto w-full max-w-md px-6 pb-8">{footer}</footer>
      ) : null}
    </div>
  );
}
