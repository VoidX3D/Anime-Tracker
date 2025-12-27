'use client';

import { useState, useEffect } from 'react';

interface FilterBarProps {
    search: string;
    setSearch: (s: string) => void;
    sort: string;
    setSort: (s: string) => void;
    view: 'grid' | 'list';
    setView: (v: 'grid' | 'list') => void;
    genre: string;
    setGenre: (g: string) => void;
    total: number;
    genres: string[];
}

export default function FilterBar({ search, setSearch, sort, setSort, view, setView, genre, setGenre, total, genres }: FilterBarProps) {
    const [localSearch, setLocalSearch] = useState(search);

    useEffect(() => {
        const handler = setTimeout(() => {
            if (localSearch !== search) setSearch(localSearch);
        }, 500);
        return () => clearTimeout(handler);
    }, [localSearch, setSearch, search]);

    return (
        <div className="flex flex-col lg:flex-row gap-8 items-center justify-between glass-card rounded-3xl p-8 shadow-2xl border-white/5 relative overflow-hidden">
            <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-20" />

            {/* Neural Search */}
            <div className="flex flex-col gap-3 w-full lg:w-auto flex-1">
                <label className="text-[10px] font-black text-primary uppercase tracking-[0.3em] px-1 glow-text">Neural Search</label>
                <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Scan archive designations..."
                        value={localSearch}
                        onChange={(e) => setLocalSearch(e.target.value)}
                        className="w-full lg:w-80 bg-background/50 border border-white/5 rounded-xl pl-12 pr-5 py-4 text-sm text-white font-bold focus:ring-2 focus:ring-primary/50 outline-none transition-all placeholder:text-text-muted/20"
                    />
                </div>
            </div>

            {/* Filters Partition */}
            <div className="flex flex-wrap items-center gap-8 w-full lg:w-auto">
                {/* Sector Vector (Genre) */}
                <div className="flex flex-col gap-3 min-w-[160px]">
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] px-1">Sector Vector</label>
                    <select
                        value={genre}
                        onChange={(e) => setGenre(e.target.value)}
                        className="bg-background/50 border border-white/5 text-white font-bold text-sm rounded-xl px-5 py-4 focus:ring-2 focus:ring-primary/50 outline-none cursor-pointer hover:border-primary/30 transition-all appearance-none"
                    >
                        <option value="">All Sectors</option>
                        {genres.map(g => (
                            <option key={g} value={g}>{g}</option>
                        ))}
                    </select>
                </div>

                {/* Magnitude Sort */}
                <div className="flex flex-col gap-3 min-w-[160px]">
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] px-1">Magnitude Sort</label>
                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        className="bg-background/50 border border-white/5 text-white font-bold text-sm rounded-xl px-5 py-4 focus:ring-2 focus:ring-primary/50 outline-none cursor-pointer hover:border-primary/30 transition-all appearance-none"
                    >
                        <option value="pop_desc">Popularity</option>
                        <option value="score_desc">Performance</option>
                        <option value="title_asc">Designation</option>
                        <option value="year_desc">Chronology</option>
                    </select>
                </div>

                {/* View Matrix */}
                <div className="flex flex-col gap-3">
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] px-1">View Matrix</label>
                    <div className="flex items-center bg-background/50 border border-white/5 rounded-xl p-1.5 h-[54px] shadow-inner">
                        <button
                            onClick={() => setView('grid')}
                            className={`px-4 h-full rounded-lg transition-all flex items-center justify-center ${view === 'grid' ? 'bg-primary text-white shadow-lg glow-primary' : 'text-text-muted hover:text-white hover:bg-white/5'}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1" /><rect width="7" height="7" x="14" y="3" rx="1" /><rect width="7" height="7" x="14" y="14" rx="1" /><rect width="7" height="7" x="3" y="14" rx="1" /></svg>
                        </button>
                        <button
                            onClick={() => setView('list')}
                            className={`px-4 h-full rounded-lg transition-all flex items-center justify-center ${view === 'list' ? 'bg-primary text-white shadow-lg glow-primary' : 'text-text-muted hover:text-white hover:bg-white/5'}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="8" x2="21" y1="6" y2="6" /><line x1="8" x2="21" y1="12" y2="12" /><line x1="8" x2="21" y1="18" y2="18" /><line x1="3" x2="3.01" y1="6" y2="6" /><line x1="3" x2="3.01" y1="12" y2="12" /><line x1="3" x2="3.01" y1="18" y2="18" /></svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
