import DatabaseSearchBar from '@/components/util/DatabaseSearchBar';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-2xl mx-auto space-y-10">
        <header>
          <h1 className="text-3xl font-bold tracking-tight">Component Registry</h1>
          <p className="text-neutral-400 mt-2">
            Testing the <code className="text-blue-400">DatabaseSearchBar</code> component.
          </p>
        </header>

        <section className="p-10 border border-neutral-800 rounded-2xl bg-neutral-900/50 flex flex-col items-center shadow-2xl">
          <h2 className="text-sm uppercase tracking-widest text-neutral-500 mb-6">Interactive Preview</h2>
          <DatabaseSearchBar />
          <div className="mt-4 text-xs text-neutral-600 italic">
            Endpoint: /api/games/search?q=...
          </div>
        </section>

        <section className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Quality Assurance Checklist</h2>
          <ul className="space-y-3 text-sm text-neutral-300">
            <li className="flex items-center gap-2">✅ <span className="text-neutral-500">Debounce:</span> Verify fetch only triggers 1s after last keystroke.</li>
            <li className="flex items-center gap-2">✅ <span className="text-neutral-500">Loading:</span> Ensure "Searching..." appears during active requests.</li>
            <li className="flex items-center gap-2">✅ <span className="text-neutral-500">Z-Index:</span> Check that dropdown floats correctly above other UI elements.</li>
            <li className="flex items-center gap-2">✅ <span className="text-neutral-500">UX:</span> Click outside the component to verify the dropdown closes.</li>
          </ul>
        </section>
      </div>
    </main>
  );
}