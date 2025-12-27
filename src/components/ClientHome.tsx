'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import AnimeCard from '@/components/AnimeCard';
import AnimeListRow from '@/components/AnimeListRow';
import FilterBar from '@/components/FilterBar';
import { Anime, UserAnimeStatus } from '@/types';

interface ClientHomeProps {
    initialData: Anime[];
    totalHits: number;
    genres: string[];
    currentParams: {
        page: number;
        search: string;
        status: UserAnimeStatus | 'ALL';
        genre: string;
        sort: string;
    };
}

export default function ClientHome({ initialData, totalHits, genres, currentParams }: ClientHomeProps) {
    const router = useRouter();
    const [view, setView] = useState<'grid' | 'list'>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('library-view') as 'grid' | 'list';
            return saved || 'grid';
        }
        return 'grid';
    });
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleSetView = (v: 'grid' | 'list') => {
        setView(v);
        localStorage.setItem('library-view', v);
    };

    const updateParams = (updates: Record<string, string | number>) => {
        const params = new URLSearchParams(window.location.search);
        Object.entries(updates).forEach(([key, value]) => {
            if (value === 'ALL' || value === '') params.delete(key);
            else params.set(key, value.toString());
        });
        params.set('page', '1'); // Reset to page 1 on filter
        router.push(`/library?${params.toString()}`);
    };

    const statusTabs: { id: UserAnimeStatus | 'ALL', label: string }[] = [
        { id: 'ALL', label: 'All Library' },
        { id: 'TO_WATCH', label: 'Watching' },
        { id: 'PLANNING', label: 'Planning' },
        { id: 'COMPLETED', label: 'Completed' },
        { id: 'ON_HOLD', label: 'On Hold' },
        { id: 'DROPPED', label: 'Dropped' },
    ];

    if (!isMounted) return <div className="min-h-[400px] flex items-center justify-center"><div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;

    return (
        <div className="space-y-12 animate-fade-in stagger-2">
            {/* Main Library Control */}
            <section className="space-y-8">
                {/* Status Tabs UI */}
                <div className="flex items-center gap-1 border-b border-white/5 p-1 overflow-x-auto scrollbar-none">
                    {statusTabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => updateParams({ status: tab.id })}
                            className={`px-8 py-4 rounded-t-2xl text-sm font-black tracking-widest transition-all relative whitespace-nowrap uppercase ${currentParams.status === tab.id
                                ? 'text-primary glow-text bg-primary/5'
                                : 'text-text-muted hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {tab.label}
                            {currentParams.status === tab.id && (
                                <div className="absolute bottom-[-1px] left-0 w-full h-[3px] bg-primary rounded-full shadow-[0_0_15px_var(--primary-glow)]" />
                            )}
                        </button>
                    ))}
                </div>

                <FilterBar
                    search={currentParams.search}
                    setSearch={(s) => updateParams({ search: s })}
                    sort={currentParams.sort}
                    setSort={(s) => updateParams({ sort: s })}
                    view={view}
                    setView={handleSetView}
                    genre={currentParams.genre}
                    setGenre={(g) => updateParams({ genre: g })}
                    genres={genres}
                    total={totalHits}
                />

                {view === 'grid' ? (
                    <div className="dense-grid">
                        {initialData.map((anime, idx) => (
                            <div key={anime.id} className={`animate-fade-in stagger-${(idx % 5) + 1}`}>
                                <AnimeCard
                                    anime={anime}
                                    status={anime.ustatus as UserAnimeStatus}
                                    showStatus={true}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="glass-card rounded-[2rem] overflow-hidden shadow-2xl border-white/5">
                        {/* List Header */}
                        <div className="flex items-center gap-6 py-4 px-8 bg-background/50 border-b border-white/5 text-[10px] font-black text-text-muted uppercase tracking-[0.3em]">
                            <div className="w-8 text-center shrink-0 opacity-40">SEQ</div>
                            <div className="w-12 shrink-0" />
                            <div className="flex-1">DESIGNATION</div>
                            <div className="w-16 text-center shrink-0">MAGNITUDE</div>
                            <div className="w-20 text-center shrink-0 hidden sm:block">CLASS</div>
                            <div className="w-20 text-center shrink-0 hidden md:block">CYCLES</div>
                            <div className="w-24 text-right shrink-0">STATUS</div>
                        </div>
                        {initialData.map((anime, idx) => (
                            <AnimeListRow
                                key={anime.id}
                                anime={anime}
                                status={anime.ustatus as UserAnimeStatus}
                                index={idx + (currentParams.page - 1) * 30}
                            />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

function SearchIcon({ className }: { className?: string }) { return <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>; }
