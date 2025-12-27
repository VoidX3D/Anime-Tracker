'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -z-10 animate-pulse" />
            <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -z-10" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('/grid.svg')] opacity-[0.02] -z-10" />

            <main className="max-w-5xl space-y-16 py-20 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="space-y-8"
                >
                    <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-surface/50 border border-white/5 text-[10px] font-black tracking-[0.4em] text-primary shadow-2xl glow-primary uppercase">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        Millennium_Archive_V14.0_Stable
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-[0.9] uppercase">
                        Precision Tracking<br />
                        <span className="text-primary glow-text">Neural_Discovery</span>
                    </h1>

                    <div className="text-xl md:text-2xl text-text-muted max-w-3xl mx-auto leading-relaxed font-medium">
                        {`The Millennium Archive is an industrial-grade anime management sanctuary. Designed for high-density tracking, algorithmic exploration, and surgical repository maintenance. Archive 10,000+ units with zero-lag performance.`.split(' ').map((word, i) => (
                            <motion.span
                                key={i}
                                initial={{ opacity: 0, filter: 'blur(10px)' }}
                                animate={{ opacity: 1, filter: 'blur(0px)' }}
                                transition={{ delay: 0.5 + i * 0.02, duration: 0.2 }}
                                className="inline-block mr-1.5"
                            >
                                {word}
                            </motion.span>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.2, duration: 0.5 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-6"
                >
                    <Link
                        href="/library"
                        className="group relative w-full sm:w-auto px-12 py-5 bg-primary text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-[0_0_30px_rgba(37,99,235,0.4)] hover:glow-primary hover:scale-105 transition-all active:scale-95 text-sm"
                    >
                        Enter_Control_Center
                        <div className="absolute inset-0 rounded-2xl border-2 border-white/20 scale-110 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all" />
                    </Link>
                    <Link
                        href="/suggestions"
                        className="w-full sm:w-auto px-12 py-5 bg-surface/50 border border-white/5 text-white font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-white/5 hover:border-primary/50 transition-all text-sm"
                    >
                        Neural_Scan
                    </Link>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-20 border-t border-white/5">
                    <FeatureCard
                        index={1}
                        title="Millennium Velocity"
                        desc="Server-side pagination and optimized Supabase indexing ensure instant retrieval across 10,000+ units."
                        icon="01"
                    />
                    <FeatureCard
                        index={2}
                        title="Algorithmic Purity"
                        desc="Advanced neural weighting calculates your genre affinity and suggests high-fidelity candidates with surgical accuracy."
                        icon="02"
                    />
                    <FeatureCard
                        index={3}
                        title="Industrial UX"
                        desc="A high-density, multi-chromatic command center designed for elite watchers who demand control over their archive."
                        icon="03"
                    />
                </div>
            </main>

            {/* Bottom Industrial Mark */}
            <div className="absolute bottom-10 left-10 flex flex-col gap-1 opacity-10">
                <div className="w-40 h-px bg-white" />
                <span className="text-[10px] font-black text-white uppercase tracking-[0.5em]">System_Designate: ANTIGRAVITY</span>
            </div>
        </div>
    );
}

function FeatureCard({ title, desc, icon, index }: { title: string, desc: string, icon: string, index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 + index * 0.1 }}
            className="p-10 rounded-[2.5rem] bg-surface/30 border border-white/5 hover:border-primary/40 transition-all text-left space-y-6 group hover:glass-card"
        >
            <div className="text-4xl font-black text-primary/20 group-hover:text-primary transition-colors duration-500">{icon}</div>
            <div className="space-y-4">
                <h3 className="text-xl font-black text-white uppercase tracking-tighter">{title}</h3>
                <p className="text-sm text-text-muted leading-relaxed font-medium">{desc}</p>
            </div>
        </motion.div>
    );
}
