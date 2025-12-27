'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Anime } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import NeuralImage from './NeuralImage';

interface SpotlightCarouselProps {
    items: Anime[];
}

export default function SpotlightCarousel({ items }: SpotlightCarouselProps) {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % items.length);
        }, 10000); // 10 SECOND FREQUENCY
        return () => clearInterval(interval);
    }, [items.length]);

    const anime = items[index];
    const title = anime.title_english || anime.title_romaji;

    return (
        <section className="relative h-[450px] w-full rounded-[3rem] overflow-hidden group shadow-2xl border border-white/5 animate-fade-in">
            <AnimatePresence mode="wait">
                <motion.div
                    key={anime.id}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0"
                >
                    {/* Banner Background */}
                    <NeuralImage
                        src={anime.banner_image!}
                        alt={title}
                        fill
                        className="object-cover opacity-60"
                        priority
                        sizes="100vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

                    {/* Content Overlay */}
                    <div className="absolute inset-0 p-12 md:p-20 flex flex-col justify-center max-w-3xl gap-8 z-10">
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="flex items-center gap-4"
                        >
                            <span className="px-4 py-1.5 bg-primary/20 border border-primary/30 rounded-full text-[10px] font-black text-primary uppercase tracking-[0.4em] glow-text">
                                TRENDING_SECTOR_{index + 1}
                            </span>
                            <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] border-l border-white/10 pl-4">
                                NEURAL_ID: 0x{anime.id.toString(16)}
                            </span>
                        </motion.div>

                        <div className="space-y-4">
                            <motion.h2
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[0.9] drop-shadow-2xl"
                            >
                                {title}
                            </motion.h2>
                            {anime.title_native && (
                                <motion.p
                                    initial={{ y: 10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.6 }}
                                    className="text-xl text-text-muted font-medium italic opacity-40"
                                >
                                    {anime.title_native}
                                </motion.p>
                            )}
                        </div>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                            className="text-text-main/80 line-clamp-2 text-lg font-medium leading-relaxed max-w-xl"
                            dangerouslySetInnerHTML={{ __html: anime.description?.replace(/<[^>]*>?/gm, '') || '' }}
                        />

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="flex items-center gap-8 pt-4"
                        >
                            <Link
                                href={`/anime/${anime.id}`}
                                className="px-10 py-5 bg-primary text-white rounded-2xl font-black uppercase tracking-widest hover:glow-primary transition-all duration-300 transform hover:scale-105 shadow-[0_0_30px_rgba(37,99,235,0.4)]"
                            >
                                Launch Archive
                            </Link>
                            <div className="flex flex-col border-l border-white/10 pl-8">
                                <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Neural Match</span>
                                <span className="text-3xl font-black text-white glow-text">{anime.average_score}%</span>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Pagination Indicators */}
            <div className="absolute bottom-10 right-12 flex gap-3 z-20">
                {items.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setIndex(i)}
                        className={`group relative h-1.5 transition-all duration-500 rounded-full overflow-hidden ${i === index ? 'w-12 bg-primary shadow-[0_0_15px_var(--primary-glow)]' : 'w-3 bg-white/20 hover:bg-white/40'}`}
                    >
                        {i === index && (
                            <motion.div
                                className="absolute inset-0 bg-white/40 origin-left"
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ duration: 10, ease: "linear" }}
                            />
                        )}
                    </button>
                ))}
            </div>

            {/* Industrial Decals */}
            <div className="absolute top-10 right-12 flex flex-col items-end gap-2 opacity-10">
                <div className="h-0.5 w-32 bg-primary" />
                <div className="h-0.5 w-20 bg-primary" />
                <div className="h-0.5 w-12 bg-primary" />
            </div>
        </section>
    );
}
