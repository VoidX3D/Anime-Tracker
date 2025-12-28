'use client';

interface RatingDisplayProps {
    rating: number;
    size?: 'sm' | 'md' | 'lg';
    showNumber?: boolean;
}

export default function RatingDisplay({
    rating,
    size = 'sm',
    showNumber = true
}: RatingDisplayProps) {
    const sizes = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8'
    };

    const textSizes = {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base'
    };

    const renderStar = (index: number) => {
        const value = index + 1;
        const isFilled = rating >= value;
        const isHalf = rating >= value - 0.5 && rating < value;

        return (
            <div key={index} className={`${sizes[size]} relative`}>
                {/* Background star */}
                <svg
                    className="absolute inset-0 w-full h-full text-surface/20"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>

                {/* Filled star */}
                {(isFilled || isHalf) && (
                    <svg
                        className="absolute inset-0 w-full h-full text-primary"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        style={{
                            clipPath: isHalf ? 'inset(0 50% 0 0)' : 'none'
                        }}
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                )}
            </div>
        );
    };

    return (
        <div className="flex items-center gap-0.5">
            {[...Array(10)].map((_, i) => renderStar(i))}

            {showNumber && (
                <span className={`ml-2 font-black text-primary ${textSizes[size]}`}>
                    {rating.toFixed(1)}
                </span>
            )}
        </div>
    );
}
