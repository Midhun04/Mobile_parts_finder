type Props = {
  message?: string;
};

export function LoadingState({ message = 'Loading…' }: Props) {
  return (
    <div className="flex flex-1 items-center justify-center px-5 py-16 text-text-secondary">
      {message}
    </div>
  );
}

export function ErrorState({ message = 'Something went wrong.' }: Props) {
  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      <div className="rounded-2xl border border-danger/30 bg-surface p-5">
        <p className="font-bold text-danger">Unable to load data</p>
        <p className="mt-2 text-sm text-text-secondary">{message}</p>
        <p className="mt-3 text-sm text-text-muted">
          Make sure the API is running at{' '}
          <code className="rounded bg-surface-muted px-1.5 py-0.5 text-xs">
            {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}
          </code>
        </p>
      </div>
    </div>
  );
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <p className="font-bold text-foreground">{title}</p>
      <p className="mt-1.5 text-sm leading-5 text-text-secondary">{body}</p>
    </div>
  );
}
