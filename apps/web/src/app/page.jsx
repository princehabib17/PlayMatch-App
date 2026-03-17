export default function Page() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-6">
      <section className="max-w-xl text-center space-y-4">
        <h1 className="text-3xl sm:text-4xl font-semibold">PlayMatch is ready</h1>
        <p className="text-slate-300">
          Your app was rendering a blank page because the root route returned <code>null</code>.
          This starter view confirms routing and rendering are working.
        </p>
      </section>
    </main>
  );
}
