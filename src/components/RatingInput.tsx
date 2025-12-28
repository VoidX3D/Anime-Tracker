'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface RatingInputProps {
    initialRating?: number;
    onRate: (rating: number) => void;
    size?: 'sm' | 'md' | 'lg';
    readonly?: boolean;
}

export default function RatingInput({
    initialRating = 0,
    onRate,
    size = 'md',
    readonly = false
}: RatingInputProps) {
    const [rating, setRating] = useState(initialRating);
    const [hoverRating, setHoverRating] = useState(0);

    const sizes = {
        sm: 'w-6 h-6 text-sm',
        md: 'w-8 h-8 text-base',
        lg: 'w-10 h-10 text-lg'
    };

    const handleClick = (value: number) => {
        if (readonly) return;

        // Allow half-star ratings
        const newRating = rating === value ? value - 0.5 : value;
        setRating(newRating);
        onRate(newRating);
    };

    const renderStar = (index: number) => {
        const value = index + 1;
        const displayRating = hoverRating || rating;
        const isFilled = displayRating >= value;
        const isHalf = displayRating >= value - 0.5 && displayRating < value;

        return (
            <motion.button
                key={index}
                type="button"
                disabled={readonly}
                onClick={() => handleClick(value)}
                onMouseEnter={() => !readonly && setHoverRating(value)}
                onMouseLeave={() => !readonly && setHoverRating(0)}
                className={`${sizes[size]} relative transition-all ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
                    }`}
                whileTap={readonly ? {} : { scale: 0.9 }}
            >
                {/* Background star */}
                <svg
                    className="absolute inset-0 w-full h-full text-surface/30"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>

                {/* Filled star */}
                {(isFilled || isHalf) && (
                    <svg
                        className={`absolute inset-0 w-full h-full transition-colors ${hoverRating ? 'text-primary' : 'text-primary/90'
                            }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        style={{
                            clipPath: isHalf ? 'inset(0 50% 0 0)' : 'none'
                        }}
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                )}

                {/* Glow effect on hover */}
                {hoverRating >= value && !readonly && (
                    <div className="absolute inset-0 w-full h-full blur-md bg-primary/30 -z-10" />
                )}
            </motion.button>
        );
    };

    return (
        <div className="flex items-center gap-1">
            {[...Array(10)].map((_, i) => renderStar(i))}

            {/* Rating display */}
            <span className="ml-3 text-lg font-black text-primary min-w-[3rem]">
                {(hoverRating || rating).toFixed(1)}
            </span>
        </div>
    );
}
