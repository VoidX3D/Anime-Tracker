'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface NeuralImageProps {
    src: string;
    alt: string;
    fill?: boolean;
    className?: string;
    priority?: boolean;
    sizes?: string;
}

export default function NeuralImage({ src, alt, fill, className, priority, sizes }: NeuralImageProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    return (
        <div className={`relative overflow-hidden bg-surface/50 ${fill ? 'w-full h-full' : ''} ${className}`}>
            <AnimatePresence>
                {isLoading && (
                    <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-surface"
                    >
                        {/* Industrial Skeleton */}
                        <div className="absolute inset-0 bg-gradient-to-br from-surface via-surface-hover to-surface animate-pulse" />
                        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-primary/5 to-transparent animate-pulse" />

                        {/* Scanning Line */}
                        <motion.div
                            initial={{ top: '-10%' }}
                            animate={{ top: '110%' }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-x-0 h-px bg-primary/40 shadow-[0_0_15px_var(--primary-glow)] z-20"
                        />

                        <div className="relative z-10 flex flex-col items-center gap-2">
                            <span className="text-[8px] font-black text-primary/40 uppercase tracking-[0.4em] animate-pulse">Scanning_Archive...</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {isError ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface text-error/30 gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21 21-4.3-4.3" /><circle cx="11" cy="11" r="8" /><line x1="11" y1="8" x2="11" y2="12" /><line x1="11" y1="16" x2="11.01" y2="16" /></svg>
                    <span className="text-[8px] font-black uppercase tracking-widest">Designation_Missing</span>
                </div>
            ) : (
                <Image
                    src={src || '/placeholder.png'}
                    alt={alt}
                    fill={fill}
                    className={`object-cover transition-all duration-700 ${isLoading ? 'scale-110 blur-xl opacity-0' : 'scale-100 blur-0 opacity-100'}`}
                    onLoad={() => setIsLoading(false)}
                    onError={() => {
                        setIsError(true);
                        setIsLoading(false);
                    }}
                    priority={priority}
                    sizes={sizes}
                />
            )}

            {/* Micro Industrial Overlay */}
            {!isLoading && !isError && (
                <div className="absolute inset-0 pointer-events-none border border-white/5" />
            )}
        </div>
    );
}
