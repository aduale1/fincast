import { formatCents } from '@fincast/shared';

export function App() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center gap-4 px-4">
      <h1 className="text-3xl font-semibold text-slate-900">Fincast</h1>
      <p className="text-slate-600">
        Cash-flow forecasting for people with irregular income. Coming soon.
      </p>
      <p className="text-sm text-slate-500">Shared package check: {formatCents(123456)}</p>
    </main>
  );
}
