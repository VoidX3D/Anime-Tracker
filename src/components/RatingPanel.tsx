'use client';

import { useState, useTransition } from 'react';
import { motion } from 'framer-motion';
import RatingInput from './RatingInput';
import { setRating, deleteRating } from '@/app/actions/ratings';

interface RatingPanelProps {
    animeId: number;
    initialRating?: number;
    initialReview?: string;
}

export default function RatingPanel({ animeId, initialRating = 0, initialReview = '' }: RatingPanelProps) {
    const [rating, setRatingState] = useState(initialRating);
    const [review, setReview] = useState(initialReview);
    const [showReview, setShowReview] = useState(!!initialReview);
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState('');

    const handleRating = (newRating: number) => {
        setRatingState(newRating);

        startTransition(async () => {
            const result = await setRating({
                anime_id: animeId,
                rating: newRating,
                review: review || undefined
            });

            if (result.error) {
                setMessage(`Error: ${result.error}`);
            } else {
                setMessage('Rating saved! 🛰️');
                setTimeout(() => setMessage(''), 2000);
            }
        });
    };

    const handleReviewSave = () => {
        startTransition(async () => {
            const result = await setRating({
                anime_id: animeId,
                rating,
                review: review || undefined
            });

            if (result.error) {
                setMessage(`Error: ${result.error}`);
            } else {
                setMessage('Review saved! 🛰️');
                setTimeout(() => setMessage(''), 2000);
            }
        });
    };

    const handleDelete = () => {
        startTransition(async () => {
            const result = await deleteRating(animeId);

            if (result.error) {
                setMessage(`Error: ${result.error}`);
            } else {
                setRatingState(0);
                setReview('');
                setShowReview(false);
                setMessage('Rating deleted');
                setTimeout(() => setMessage(''), 2000);
            }
        });
    };

    return (
        <div className="bg-surface/30 border border-border rounded-3xl p-6 backdrop-blur-md space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Your Rating
                </h3>
                {rating > 0 && (
                    <button
                        onClick={handleDelete}
                        disabled={isPending}
                        className="text-xs text-text-muted hover:text-red-400 transition-colors"
                    >
                        Clear
                    </button>
                )}
            </div>

            <RatingInput
                initialRating={rating}
                onRate={handleRating}
                size="lg"
            />

            {/* Review Section */}
            {!showReview && rating > 0 && (
                <button
                    onClick={() => setShowReview(true)}
                    className="text-sm text-primary hover:text-primary/80 transition-colors font-medium"
                >
                    + Add Review
                </button>
            )}

            {showReview && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-3"
                >
                    <textarea
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        placeholder="Share your thoughts..."
                        className="w-full bg-background/50 border border-border rounded-xl p-4 text-sm text-white placeholder:text-text-muted focus:border-primary/50 focus:outline-none resize-none min-h-[120px]"
                    />
                    <div className="flex gap-2">
                        <button
                            onClick={handleReviewSave}
                            disabled={isPending}
                            className="px-4 py-2 bg-primary text-white text-xs font-black uppercase tracking-wider rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                        >
                            {isPending ? 'Saving...' : 'Save Review'}
                        </button>
                        <button
                            onClick={() => {
                                setShowReview(false);
                                setReview('');
                            }}
                            className="px-4 py-2 bg-surface text-text-muted text-xs font-black uppercase tracking-wider rounded-lg hover:bg-surface/80 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </motion.div>
            )}

            {/* Saved review display */}
            {!showReview && review && (
                <div className="bg-background/30 rounded-xl p-4 border border-border/50">
                    <p className="text-sm text-text-main leading-relaxed">{review}</p>
                    <button
                        onClick={() => setShowReview(true)}
                        className="text-xs text-primary hover:text-primary/80 mt-2 transition-colors"
                    >
                        Edit
                    </button>
                </div>
            )}

            {/* Status message */}
            {message && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-primary font-medium"
                >
                    {message}
                </motion.div>
            )}
        </div>
    );
}
