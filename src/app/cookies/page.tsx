export default function CookiesPage() {
    return (
        <main className="min-h-screen p-8 md:p-16 max-w-4xl mx-auto space-y-12 pb-40">
            <header className="space-y-4">
                <h1 className="text-5xl font-black text-white tracking-tighter uppercase">Cookie_Protocol</h1>
                <div className="h-1 w-20 bg-primary" />
            </header>

            <section className="space-y-8 text-text-main/90 leading-relaxed font-medium">
                <div className="space-y-4">
                    <h2 className="text-xl font-black text-white uppercase tracking-widest">Digital_Seeds</h2>
                    <p>
                        We utilize minimal &ldquo;Digital Seeds&rdquo; (cookies and localStorage) to persist your operational preferences.
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-text-muted">
                        <li><strong>at-theme</strong>: Remembers your selected chromatic sector (Cyberpunk, etc.).</li>
                        <li><strong>library-view</strong>: Remembers your preferred archive matrix (Grid/List).</li>
                        <li><strong>neural-session</strong>: Maintains secure uplink to the primary vault.</li>
                    </ul>
                </div>
            </section>
        </main>
    )
}
