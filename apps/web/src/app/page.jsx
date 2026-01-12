
export default function Page() {
  return (
    <main style={{ padding: 24, fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif' }}>
      <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>PlayMatch</h1>
      <p style={{ marginTop: 8, marginBottom: 16, color: '#555' }}>
        This server is running. If you expected the mobile app UI, start the Expo app in
        <code style={{ padding: '0 6px' }}>apps/mobile</code>.
      </p>

      <section style={{ display: 'grid', gap: 8 }}>
        <a href="/api/games">View games API</a>
        <a href="/api/games/1">View a game (example)</a>
      </section>
    </main>
  );
}
