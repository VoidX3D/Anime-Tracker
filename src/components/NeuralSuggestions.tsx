'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import AnimeCard from '@/components/AnimeCard';
import { Anime } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

export default function NeuralSuggestions() {
    const [suggestions, setSuggestions] = useState<Anime[]>([]);
    const [isScanning, setIsScanning] = useState(true);
    const [favoriteGenres, setFavoriteGenres] = useState<Record<string, number>>({});

    const fetchSuggestions = useCallback(async (genres: Record<string, number>) => {
        setIsScanning(true);

        // 1. Establish Excluded Set (Anime already in library)
        const { data: excluded } = await supabase
            .from('animes')
            .select('id')
            .not('ustatus', 'is', null);

        const excludedIds = new Set(excluded?.map(e => e.id) || []);

        // 2. Query candidates
        const { data: candidates } = await supabase
            .from('animes')
            .select('*')
            .is('ustatus', null)
            .gte('average_score', 60)
            .order('popularity', { ascending: false })
            .limit(300);

        if (candidates) {
            // 3. Filter and Weight
            const weighted = candidates
                .filter(a => !excludedIds.has(a.id))
                .map(a => {
                    let weight = Math.random() * 200; // Neural Salt (High Entropy)
                    a.genres?.forEach((g: string) => {
                        weight += (genres[g] || 0) * 20;
                    });
                    weight += (a.average_score || 0) * 5;
                    weight += (a.popularity || 0) / 200;
                    return { ...a, neuralWeight: weight };
                })
                .sort((a, b) => b.neuralWeight - a.neuralWeight)
                .slice(0, 10);

            setSuggestions(weighted as Anime[]);
        }

        setTimeout(() => setIsScanning(false), 1000);
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
            fetchSuggestions(genres);
        };
        init();
    }, [fetchSuggestions]);

    if (!suggestions.length && !isScanning) return null;

    return (
        <section className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="h-6 w-1.5 bg-primary rounded-full shadow-[0_0_10px_var(--primary-glow)]" />
                    <h2 className="text-xl font-black text-white uppercase tracking-wider">Neural Suggestions</h2>
                    <AnimatePresence mode="wait">
                        {isScanning ? (
                            <motion.span
                                key="scanning"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-[10px] font-black text-primary border border-primary/20 px-2 py-0.5 rounded uppercase tracking-widest animate-pulse"
                            >
                                Scanning_Archive...
                            </motion.span>
                        ) : (
                            <motion.span
                                key="active"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-[10px] font-black text-primary/60 border border-primary/20 px-2 py-0.5 rounded uppercase tracking-widest"
                            >
                                Match_Verified
                            </motion.span>
                        )}
                    </AnimatePresence>
                </div>

                <button
                    onClick={() => fetchSuggestions(favoriteGenres)}
                    disabled={isScanning}
                    className="group flex items-center gap-2 px-4 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all duration-300 disabled:opacity-50"
                >
                    <svg
                        className={`w-3 h-3 text-text-muted group-hover:text-primary transition-colors ${isScanning ? 'animate-spin' : ''}`}
                        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                    >
                        <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
                        <path d="M21 3v5h-5" />
                    </svg>
                    <span className="text-[10px] font-black text-text-muted group-hover:text-white uppercase tracking-widest">Reroll_Neural_Feed</span>
                </button>
            </div>

            <div className="relative group">
                <AnimatePresence mode="wait">
                    {isScanning ? (
                        <motion.div
                            key="loader"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex gap-6 overflow-hidden pb-6 pt-2"
                        >
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="w-[200px] h-[300px] shrink-0 bg-surface/50 rounded-xl animate-pulse border border-white/5" />
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="content"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex gap-6 overflow-x-auto pb-6 pt-2 -mx-2 px-2 scrollbar-none snap-x mask-fade-right"
                        >
                            {suggestions.map((anime, idx) => (
                                <div key={anime.id} className="w-[200px] shrink-0 snap-start transition-all duration-500 hover:-translate-y-2">
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

                {/* Scroll Indicators */}
                {!isScanning && (
                    <div className="absolute top-1/2 -right-4 translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <div className="h-20 w-1 bg-primary/20 rounded-full" />
                    </div>
                )}
            </div>
        </section>
    );
}
