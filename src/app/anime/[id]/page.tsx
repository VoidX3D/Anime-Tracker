import { supabase } from '@/lib/supabaseClient';
import { UserAnimeStatus } from '@/types';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import StatusSelector from '@/components/StatusSelector';
import ProgressTracker from '@/components/ProgressTracker';
import RelatedAnime from '@/components/RelatedAnime';

export async function generateStaticParams() {
    const { data: animes } = await supabase.from('animes').select('id');
    return animes?.map((anime) => ({
        id: anime.id.toString(),
    })) || [];
}

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function AnimeDetail({ params }: PageProps) {
    const { id } = await params;
    const animeId = parseInt(id);

    // Fetch Anime
    const { data: anime } = await supabase
        .from('animes')
        .select('*')
        .eq('id', animeId)
        .single();

    if (!anime) notFound();

    const userStatus = anime.ustatus as UserAnimeStatus;

    return (
        <div className="min-h-screen">
            {/* Banner */}
            <div className="h-[200px] md:h-[300px] w-full relative bg-surface overflow-hidden">
                {anime.banner_image && (
                    <Image src={anime.banner_image} alt="Banner" fill className="object-cover opacity-50" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
            </div>

            <div className="max-w-7xl mx-auto px-6 -mt-32 md:-mt-40 relative z-10 pb-20">
                <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-8">
                    {/* LEFT COLUMN: Cover & Actions */}
                    <div className="space-y-6">
                        <div className="relative aspect-[2/3] w-full rounded-lg overflow-hidden shadow-2xl border-4 border-surface">
                            {anime.cover_image ? (
                                <Image src={anime.cover_image} alt={anime.title_romaji} fill className="object-cover" />
                            ) : (
                                <div className="bg-surface w-full h-full flex items-center justify-center text-text-muted">No Image</div>
                            )}
                        </div>

                        <div className="bg-surface border border-border rounded-xl p-4 space-y-4">
                            <div>
                                <label className="text-xs font-mono uppercase text-text-muted mb-2 block">Status</label>
                                <StatusSelector animeId={anime.id} currentStatus={userStatus} />
                            </div>
                            <div>
                                <ProgressTracker current={0} total={anime.episodes} />
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Info */}
                    <div className="pt-2 md:pt-12">
                        <div className="flex flex-col md:flex-row md:items-end gap-2 md:gap-4 mb-2">
                            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">{anime.title_english || anime.title_romaji}</h1>
                            {anime.season && (
                                <span className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-[10px] font-black uppercase text-primary tracking-widest mb-1.5 self-start md:self-auto">
                                    {anime.season} {anime.season_year}
                                </span>
                            )}
                        </div>
                        {anime.title_native && <h2 className="text-xl text-text-muted mb-6 font-medium italic opacity-70">{anime.title_native}</h2>}

                        <div className="flex flex-wrap gap-2 mb-8">
                            {anime.format && (
                                <span className="px-3 py-1 bg-surface border border-border rounded-full text-xs font-bold text-white uppercase">
                                    {anime.format}
                                </span>
                            )}
                            {anime.genres?.map((g: string) => (
                                <span key={g} className="px-3 py-1 bg-surface border border-border rounded-full text-xs font-semibold text-text-muted hover:text-white hover:border-primary/50 transition-colors cursor-pointer">
                                    {g}
                                </span>
                            ))}
                        </div>

                        <div className="bg-surface/30 border border-border rounded-3xl p-6 md:p-8 mb-8 backdrop-blur-md relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <FileTextIcon />
                            </div>
                            <h3 className="text-[10px] font-black text-text-muted mb-4 uppercase tracking-[0.2em] flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                Narrative Synopsis
                            </h3>
                            <div
                                className="text-text-main leading-relaxed space-y-4 text-sm"
                                dangerouslySetInnerHTML={{ __html: anime.description || 'Information pending transmission...' }}
                            />
                        </div>

                        {/* Connections */}
                        <div className="mb-12">
                            <RelatedAnime relations={anime.relations} />
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <DetailItem label="Format" value={anime.format || 'TV'} />
                            <DetailItem label="Episodes" value={anime.episodes} />
                            <DetailItem label="Duration" value={anime.duration ? `${anime.duration} mins` : '?'} />
                            <DetailItem label="Score" value={anime.average_score ? `${anime.average_score}%` : 'N/A'} />
                            <DetailItem label="Season" value={`${anime.season || ''} ${anime.season_year || ''}`} />
                            <DetailItem label="Source" value={anime.source} />
                            <DetailItem label="Studios" value={anime.studios?.join(', ')} />
                            <DetailItem label="Start Date" value={anime.start_date} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function DetailItem({ label, value }: { label: string, value: any }) {
    if (!value) return null;
    return (
        <div className="flex flex-col gap-1">
            <span className="text-xs text-text-muted uppercase font-mono">{label}</span>
            <span className="text-sm font-medium text-text-main">{value}</span>
        </div>
    )
}

function FileTextIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="16" x2="8" y1="13" y2="13" /><line x1="16" x2="8" y1="17" y2="17" /><line x1="10" x2="8" y1="9" y2="9" /></svg>
    )
}

