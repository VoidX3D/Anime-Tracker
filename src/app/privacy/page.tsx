export default function PrivacyPage() {
    return (
        <main className="min-h-screen p-8 md:p-16 max-w-4xl mx-auto space-y-12 pb-40">
            <header className="space-y-4">
                <h1 className="text-5xl font-black text-white tracking-tighter uppercase">Privacy_Protocol</h1>
                <div className="h-1 w-20 bg-primary" />
            </header>

            <section className="space-y-8 text-text-main/90 leading-relaxed font-medium">
                <div className="space-y-4">
                    <h2 className="text-xl font-black text-white uppercase tracking-widest">01. Data_Telemetry</h2>
                    <p>
                        AnimeTarget (Millennium Edition) localizes your watch history within your own browser and a secure Supabase enclave. We do not transmit your "Neural Index" to third-party advertisers. All telemetry is strictly operational.
                    </p>
                </div>

                <div className="space-y-4">
                    <h2 className="text-xl font-black text-white uppercase tracking-widest">02. Neural_Storage</h2>
                    <p>
                        Your localized repository (`ustatus`) is stored within our primary vault to ensure high-performance discovery and cross-device synchronization. This data is surgical and contains only archive designations.
                    </p>
                </div>

                <div className="space-y-4">
                    <h2 className="text-xl font-black text-white uppercase tracking-widest">03. Universal_Access</h2>
                    <p>
                        You retain full operational control over your data. At any point, you may purge your repository via the Mission Control (Import) interface or by contacting the system administrator.
                    </p>
                </div>
            </section>
        </main>
    )
}
