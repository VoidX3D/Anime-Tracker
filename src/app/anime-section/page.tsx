import { supabase } from '@/lib/supabaseClient';
import AnimeCard from '@/components/AnimeCard';
import { Anime, UserAnimeStatus } from '@/types';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AnimeSectionPage() {
    const statuses: UserAnimeStatus[] = ['TO_WATCH', 'COMPLETED', 'PLANNING', 'ON_HOLD', 'DROPPED'];

    const { data: allItems } = await supabase
        .from('animes')
        .select('*')
        .not('ustatus', 'is', null);

    const categorized = statuses.reduce((acc, status) => {
        acc[status] = allItems?.filter(a => a.ustatus === status) || [];
        return acc;
    }, {} as Record<UserAnimeStatus, Anime[]>);

    return (
        <main className="min-h-screen p-8 md:p-16 space-y-20 max-w-7xl mx-auto pb-40">
            <header className="space-y-4 animate-fade-in">
                <div className="flex items-center gap-4">
                    <div className="h-3 w-12 bg-primary rounded-full blur-[2px] shadow-[0_0_15px_var(--primary-glow)]" />
                    <h1 className="text-6xl font-black text-white tracking-tighter uppercase">Neural_Sectors</h1>
                </div>
                <p className="text-text-muted text-xl font-medium max-w-2xl">
                    Deep compartmentalization of your localized archive. Real-time diagnostic feed for all categorized units.
                </p>
            </header>

            {statuses.map((status, idx) => {
                const items = categorized[status];
                if (items.length === 0) return null;

                return (
                    <section key={status} className={`space-y-8 animate-fade-in stagger-${(idx % 5) + 1}`}>
                        <div className="flex items-center justify-between border-b border-white/5 pb-4">
                            <div className="flex items-center gap-4">
                                <h2 className="text-2xl font-black text-white uppercase tracking-widest">
                                    {status.replace('_', ' ')}
                                </h2>
                                <span className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-lg text-[10px] font-black text-primary glow-text">
                                    {items.length}_UNITS
                                </span>
                            </div>
                            <Link
                                href={`/library?status=${status}`}
                                className="text-[10px] font-black text-text-muted hover:text-primary transition-colors uppercase tracking-[0.3em]"
                            >
                                Expand_Sector
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
                            {items.slice(0, 5).map(anime => (
                                <AnimeCard
                                    key={anime.id}
                                    anime={anime}
                                    status={status}
                                    showStatus={false}
                                />
                            ))}
                        </div>
                    </section>
                );
            })}

            <section className="glass-card rounded-[3rem] p-12 text-center space-y-6">
                <h3 className="text-3xl font-black text-white tracking-tighter">Repository_Analytics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {statuses.map(s => (
                        <div key={s} className="flex flex-col gap-2">
                            <span className="text-xs font-black text-text-muted uppercase tracking-widest">{s}</span>
                            <span className="text-4xl font-black text-white glow-text">{categorized[s].length}</span>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}
