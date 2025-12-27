import Image from 'next/image';
import Link from 'next/link';
import { Anime, UserAnimeStatus } from '@/types';
import NeuralImage from './NeuralImage';

interface AnimeCardProps {
    anime: Anime;
    status?: UserAnimeStatus;
    showStatus?: boolean;
}

const statusColors: Record<UserAnimeStatus, string> = {
    TO_WATCH: 'text-[#3db4f2] bg-[#3db4f2]/10 border-[#3db4f2]/20',
    PLANNING: 'text-[#3db4f2] bg-[#3db4f2]/10 border-[#3db4f2]/20',
    DROPPED: 'text-[#e85d75] bg-[#e85d75]/10 border-[#e85d75]/20',
    ON_HOLD: 'text-[#f19f3d] bg-[#f19f3d]/10 border-[#f19f3d]/20',
    COMPLETED: 'text-[#3db4f2] bg-[#3db4f2]/10 border-[#3db4f2]/20',
    UNKNOWN: 'text-text-muted bg-surface/50 border-border',
};

export default function AnimeCard({ anime, status, showStatus = true }: AnimeCardProps) {
    const title = anime.title_english || anime.title_romaji;

    return (
        <Link
            href={`/anime/${anime.id}`}
            className="group block space-y-3 animate-fade-in hover-bloom h-full"
        >
            {/* Image Container */}
            <div className="relative w-full aspect-[2/3] min-h-[250px] rounded-xl overflow-hidden glass-card shadow-2xl border border-white/5 transition-all duration-500 group-hover:glow-primary group-hover:border-primary/30 bg-surface/30">
                <NeuralImage
                    src={anime.cover_image!}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                />

                {/* Industrial Overlays */}
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col gap-2 translate-y-2 group-hover:translate-y-0">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest">
                            {anime.format || 'TV'}
                        </span>
                        {anime.average_score && (
                            <span className="text-[10px] font-black text-white px-1.5 py-0.5 bg-primary rounded shadow-glow">
                                {anime.average_score}%
                            </span>
                        )}
                    </div>
                </div>

                {/* Mission Status Badge */}
                {showStatus && status && status !== 'UNKNOWN' && (
                    <div className="absolute top-3 right-3 animate-float">
                        <div className={`text-[9px] font-black px-2 py-1 rounded-md shadow-2xl backdrop-blur-xl uppercase tracking-[0.1em] border ${statusColors[status]}`}>
                            {status.replace('_', ' ')}
                        </div>
                    </div>
                )}
            </div>

            {/* Title Section */}
            <div className="space-y-1.5 px-1 pb-2">
                <h3 className="text-sm font-bold text-text-main line-clamp-2 leading-tight group-hover:text-primary transition-colors tracking-tight">
                    {title}
                </h3>
            </div>
        </Link>
    )
}
