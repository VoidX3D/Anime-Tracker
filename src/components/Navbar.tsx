'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

type Theme = 'millennium' | 'cyberpunk' | 'monochrome';

export default function Navbar() {
    const pathname = usePathname();
    const [theme, setTheme] = useState<Theme>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('at-theme') as Theme;
            if (saved) {
                document.documentElement.setAttribute('data-theme', saved);
                return saved;
            }
        }
        return 'millennium';
    });

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        const themes: Theme[] = ['millennium', 'cyberpunk', 'monochrome'];
        const nextIndex = (themes.indexOf(theme) + 1) % themes.length;
        const nextTheme = themes[nextIndex];
        setTheme(nextTheme);
        document.documentElement.setAttribute('data-theme', nextTheme);
        localStorage.setItem('at-theme', nextTheme);
    };

    const isActive = (path: string) => pathname === path;

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/80 backdrop-blur-2xl h-[72px] shadow-2xl">
            <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6">
                <div className="flex items-center gap-10">
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center text-white font-black text-xl group-hover:glow-primary transition-all duration-300 transform group-hover:scale-110">
                            AT
                        </div>
                        <span className="text-xl font-black tracking-tighter text-white group-hover:text-primary transition-colors">
                            AnimeTarget
                        </span>
                    </Link>

                    <div className="hidden lg:flex items-center gap-1 bg-surface/50 p-1 rounded-xl border border-white/5">
                        <NavLink href="/library" label="Library" icon={<LayoutGridIcon />} active={isActive('/library')} />
                        <NavLink href="/search" label="Search" icon={<SearchIcon />} active={isActive('/search')} />
                        <NavLink href="/suggestions" label="Neural" icon={<SparklesIcon />} active={isActive('/suggestions')} />
                        <NavLink href="/anime-section" label="Sectors" icon={<LayersIcon />} active={isActive('/anime-section')} />
                        <NavLink href="/dashboard" label="Stats" icon={<BarChartIcon />} active={isActive('/dashboard')} />
                        <NavLink href="/import" label="Uplink" icon={<UploadIcon />} active={isActive('/import')} />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleTheme}
                        className="p-2.5 rounded-xl bg-surface/50 border border-white/5 text-text-muted hover:text-primary hover:glow-primary transition-all uppercase text-[10px] font-black tracking-widest"
                    >
                        {theme}
                    </button>
                    <div className="hidden sm:flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/20 text-[10px] font-black tracking-[0.2em] text-primary glow-text uppercase animate-pulse">
                        <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_var(--primary-glow)]" />
                        UPLINK_STABLE
                    </div>
                </div>
            </div>
        </nav>
    );
}

function NavLink({ href, label, icon, active }: { href: string, label: string, icon: React.ReactNode, active: boolean }) {
    return (
        <Link
            href={href}
            className={`
                flex items-center gap-2 px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all duration-300
                ${active ? 'text-white bg-primary shadow-lg glow-primary' : 'text-text-muted hover:text-white hover:bg-white/5'}
            `}
        >
            <span className={active ? 'scale-110' : 'opacity-70'}>{icon}</span>
            {label}
        </Link>
    )
}

// Icons
function LayoutGridIcon() { return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1" /><rect width="7" height="7" x="14" y="3" rx="1" /><rect width="7" height="7" x="14" y="14" rx="1" /><rect width="7" height="7" x="3" y="14" rx="1" /></svg>; }
function BarChartIcon() { return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="20" y2="10" /><line x1="18" x2="18" y1="20" y2="4" /><line x1="6" x2="6" y1="20" y2="16" /></svg>; }
function SearchIcon() { return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>; }
function UploadIcon() { return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" x2="12" y1="3" y2="15" /></svg>; }
function SparklesIcon() { return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3 1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275L12 3Z" /><path d="M5 3v4" /><path d="M19 17v4" /><path d="M3 5h4" /><path d="M17 19h4" /></svg>; }
function LayersIcon() { return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.1 6.13a2 2 0 0 0 0 3.74l9.07 3.95a2 2 0 0 0 1.66 0l9.07-3.95a2 2 0 0 0 0-3.74Z" /><path d="m2.1 14.13 9.07 3.95a2 2 0 0 0 1.66 0l9.07-3.95" /><path d="m2.1 10.13 9.07 3.95a2 2 0 0 0 1.66 0l9.07-3.95" /></svg>; }
