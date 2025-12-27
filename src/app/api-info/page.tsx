export default function ApiInfoPage() {
    return (
        <main className="min-h-screen p-8 md:p-16 max-w-4xl mx-auto space-y-12 pb-40">
            <header className="space-y-4">
                <h1 className="text-5xl font-black text-white tracking-tighter uppercase">API_Specifications</h1>
                <div className="h-1 w-20 bg-primary" />
            </header>

            <section className="space-y-8 text-text-main/90 leading-relaxed font-medium">
                <p>
                    The Millennium Archive is accessible via an internal neural uplink. External access is currently restricted to verified designates.
                </p>
                <div className="p-8 glass-card rounded-2xl border-white/5 font-mono text-sm space-y-4">
                    <div className="text-primary font-bold">GET /api/archive/v1/scan</div>
                    <div className="text-text-muted">Scans the universal repository for high-fidelity units based on neural weights.</div>
                </div>
            </section>
        </main>
    )
}
