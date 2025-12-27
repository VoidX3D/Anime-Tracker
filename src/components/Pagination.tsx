'use client';

import Link from 'next/link';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    baseUrl: string;
    searchParams: Record<string, string>;
}

export default function Pagination({ currentPage, totalPages, baseUrl, searchParams }: PaginationProps) {
    if (totalPages <= 1) return null;

    const createUrl = (page: number) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', page.toString());
        return `${baseUrl}?${params.toString()}`;
    };

    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
        start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
        pages.push(i);
    }

    return (
        <div className="flex items-center justify-center gap-2 py-12 animate-fade-in">
            <Link
                href={createUrl(Math.max(1, currentPage - 1))}
                className={`flex items-center justify-center w-12 h-12 rounded-xl border border-white/5 glass transition-all ${currentPage === 1 ? 'opacity-30 pointer-events-none' : 'hover:border-primary/50 hover:text-primary'}`}
            >
                <ChevronLeftIcon />
            </Link>

            {start > 1 && (
                <>
                    <Link href={createUrl(1)} className="w-12 h-12 flex items-center justify-center rounded-xl border border-white/5 glass hover:border-primary/50 text-sm font-black">1</Link>
                    {start > 2 && <span className="text-text-muted px-2">...</span>}
                </>
            )}

            {pages.map(p => (
                <Link
                    key={p}
                    href={createUrl(p)}
                    className={`w-12 h-12 flex items-center justify-center rounded-xl border transition-all text-sm font-black ${p === currentPage
                        ? 'bg-primary border-primary text-white glow-primary'
                        : 'border-white/5 glass hover:border-primary/50 text-text-muted hover:text-white'}`}
                >
                    {p}
                </Link>
            ))}

            {end < totalPages && (
                <>
                    {end < totalPages - 1 && <span className="text-text-muted px-2">...</span>}
                    <Link href={createUrl(totalPages)} className="w-12 h-12 flex items-center justify-center rounded-xl border border-white/5 glass hover:border-primary/50 text-sm font-black">{totalPages}</Link>
                </>
            )}

            <Link
                href={createUrl(Math.min(totalPages, currentPage + 1))}
                className={`flex items-center justify-center w-12 h-12 rounded-xl border border-white/5 glass transition-all ${currentPage === totalPages ? 'opacity-30 pointer-events-none' : 'hover:border-primary/50 hover:text-primary'}`}
            >
                <ChevronRightIcon />
            </Link>
        </div>
    );
}

function ChevronLeftIcon() {
    return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>;
}

function ChevronRightIcon() {
    return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>;
}
