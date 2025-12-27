import Link from 'next/link';
import Image from 'next/image';

interface RelatedAnimeItem {
    id: number;
    type: string;
    title: string;
    image: string;
    status: string;
    format: string;
    season?: string;
    season_year?: number;
}

export default function RelatedAnime({ relations }: { relations: RelatedAnimeItem[] }) {
    if (!relations || relations.length === 0) return null;

    return (
        <section className="space-y-6">
            <h3 className="text-lg font-black text-white uppercase tracking-wider flex items-center gap-3">
                <span className="h-4 w-1 bg-primary rounded-full shadow-[0_0_8px_rgba(61,180,242,0.5)]" />
                Relations
            </h3>

            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none snap-x mask-fade-right">
                {relations.map((rel, idx) => (
                    <Link
                        key={`${rel.id}-${idx}`}
                        href={`/anime/${rel.id}`}
                        className="group w-[140px] shrink-0 snap-start space-y-2"
                    >
                        <div className="relative aspect-[2/3] w-full rounded-md overflow-hidden bg-surface shadow-sm transition-transform duration-300 group-hover:-translate-y-1">
                            {rel.image ? (
                                <Image
                                    src={rel.image}
                                    alt={rel.title}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-surface flex items-center justify-center text-[10px] text-text-muted">NO IMAGE</div>
                            )}

                            {/* Relation Type Badge */}
                            <div className={`absolute top-2 left-2 px-2 py-0.5 backdrop-blur-md rounded text-[9px] font-black text-white uppercase tracking-tighter border ${rel.type === 'SEQUEL' ? 'bg-emerald-500/60 border-emerald-400/30' :
                                    rel.type === 'PREQUEL' ? 'bg-amber-500/60 border-amber-400/30' :
                                        'bg-black/60 border-white/10'
                                }`}>
                                {rel.type.replace('_', ' ')}
                            </div>
                        </div>

                        <div className="space-y-0.5 px-0.5">
                            <h4 className="text-[11px] font-bold text-text-main line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                                {rel.title}
                            </h4>
                            <div className="text-[9px] font-bold text-text-muted uppercase tracking-tight flex items-center gap-1.5">
                                <span className={rel.status === 'FINISHED' ? 'text-emerald-400' : 'text-primary'}>
                                    {rel.format}
                                </span>
                                <span className="opacity-30">•</span>
                                <span>{rel.season} {rel.season_year}</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
