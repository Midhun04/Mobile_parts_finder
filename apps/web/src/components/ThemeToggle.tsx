'use client';

import { useEffect } from 'react';

export function ThemeToggle() {
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const followSystem = (event: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme')) {
        document.documentElement.classList.toggle('dark', event.matches);
      }
    };

    media.addEventListener('change', followSystem);
    return () => media.removeEventListener('change', followSystem);
  }, []);

  const toggle = () => {
    const nextIsDark = !document.documentElement.classList.contains('dark');
    document.documentElement.classList.toggle('dark', nextIsDark);
    try {
      localStorage.setItem('theme', nextIsDark ? 'dark' : 'light');
    } catch {
      // Private browsing can block storage; the class swap still applies.
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle dark mode"
      title="Toggle dark mode"
      className="ml-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-base text-text-secondary transition hover:border-primary/40 hover:text-primary"
    >
      <span className="dark:hidden">☾</span>
      <span className="hidden dark:inline">☀</span>
    </button>
  );
}
