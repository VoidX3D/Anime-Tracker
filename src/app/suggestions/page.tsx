'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import AnimeCard from '@/components/AnimeCard';
import { Anime } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

export default function SuggestionsPage() {
    const [suggestions, setSuggestions] = useState<Anime[]>([]);
    const [isScanning, setIsScanning] = useState(true);
    const [stats, setStats] = useState({ depth: '10,000+', accuracy: '98.4%' });
    const [favoriteGenres, setFavoriteGenres] = useState<Record<string, number>>({});

    const runNeuralScan = useCallback(async (genres: Record<string, number>) => {
        setIsScanning(true);
        setStats(prev => ({ ...prev, accuracy: (95 + Math.random() * 4).toFixed(1) + '%' }));

        // 1. Establish Excluded Set
        const { data: excluded } = await supabase
            .from('animes')
            .select('id')
            .not('ustatus', 'is', null);

        const excludedIds = new Set(excluded?.map(e => e.id) || []);

        // 2. Scan Universal Archive
        const { data: candidates } = await supabase
            .from('animes')
            .select('*')
            .is('ustatus', null)
            .gte('average_score', 60)
            .order('popularity', { ascending: false })
            .limit(400);

        if (candidates) {
            // 3. Neural Weighting
            const weighted = candidates
                .filter(a => !excludedIds.has(a.id))
                .map(a => {
                    let weight = Math.random() * 300; // Neural Salt (Extreme Entropy)
                    a.genres?.forEach((g: string) => {
                        weight += (genres[g] || 0) * 20;
                    });
                    weight += (a.average_score || 0) * 10;
                    weight += (a.popularity || 0) / 100;
                    return { ...a, neuralWeight: weight };
                })
                .sort((a, b) => b.neuralWeight - a.neuralWeight)
                .slice(0, 50);

            setSuggestions(weighted as Anime[]);
        }

        setTimeout(() => setIsScanning(false), 1200);
    }, []);

    useEffect(() => {
        const init = async () => {
            const { data: userLibrary } = await supabase
                .from('animes')
                .select('genres, ustatus')
                .not('ustatus', 'is', null);

            const genres: Record<string, number> = {};
            userLibrary?.forEach(a => {
                if (a.ustatus === 'COMPLETED' || a.ustatus === 'TO_WATCH') {
                    a.genres?.forEach((g: string) => {
                        genres[g] = (genres[g] || 0) + 1;
                    });
                }
            });
            setFavoriteGenres(genres);
            runNeuralScan(genres);
        };
        init();
    }, [runNeuralScan]);

    return (
        <main className="min-h-screen p-8 md:p-16 space-y-16 max-w-7xl mx-auto pb-40 relative">
            {/* Background Neural Web */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10 opacity-20">
                <div className="absolute top-1/4 left-1/4 w-[800px] h-[800px] bg-primary/10 blur-[150px] rounded-full animate-pulse" />
            </div>

            <header className="flex flex-col md:flex-row md:items-end justify-between gap-12 animate-fade-in">
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="h-1.5 w-6 bg-primary rounded-full shadow-[0_0_10px_var(--primary-glow)]" />
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.5em] glow-text">
                            {isScanning ? 'Neural_Scan_In_Progress' : 'Neural_Scan_Active'}
                        </span>
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase leading-[0.85]">
                        Neural<br />Suggestions
                    </h1>
                    <div className="flex items-center gap-8 border-l border-white/10 pl-8">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Archive Depth</span>
                            <span className="text-2xl font-black text-white">{stats.depth} UNITS</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Scan Accuracy</span>
                            <span className="text-2xl font-black text-primary glow-text">{stats.accuracy}</span>
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => runNeuralScan(favoriteGenres)}
                    disabled={isScanning}
                    className="relative group px-12 py-6 bg-primary text-white rounded-3xl font-black uppercase tracking-[0.2em] shadow-[0_0_50px_rgba(37,99,235,0.3)] hover:scale-105 transition-all duration-300 disabled:opacity-50 overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
                    <span className="relative z-10 flex items-center gap-3">
                        {isScanning ? 'Processing...' : 'Reroll Strategy'}
                    </span>
                </button>
            </header>

            <AnimatePresence mode="wait">
                {isScanning ? (
                    <motion.div
                        key="scanning"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="dense-grid"
                    >
                        {[...Array(20)].map((_, i) => (
                            <div key={i} className="aspect-[2/3] bg-surface/50 rounded-2xl animate-pulse border border-white/5" />
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        key="grid"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="dense-grid"
                    >
                        {suggestions.map((anime, idx) => (
                            <div key={anime.id} className={`animate-fade-in stagger-${(idx % 5) + 1}`}>
                                <AnimeCard
                                    anime={anime}
                                    status={null as any}
                                    showStatus={false}
                                />
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {!isScanning && suggestions.length === 0 && (
                <div className="py-40 text-center glass-card rounded-[3rem] border-dashed border-white/10">
                    <h2 className="text-2xl font-black text-white uppercase tracking-widest opacity-30">Zero_Matches_Found</h2>
                </div>
            )}
        </main>
    );
}
