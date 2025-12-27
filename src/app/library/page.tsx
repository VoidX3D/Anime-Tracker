import { supabase } from '@/lib/supabaseClient';
import { Anime, UserAnimeStatus } from '@/types';
import ClientHome from '@/components/ClientHome';
import Spotlight from '@/components/Spotlight';
import NeuralSuggestions from '@/components/NeuralSuggestions';
import Pagination from '@/components/Pagination';
import Link from 'next/link';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function LibraryPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || '1');
  const search = params.search || '';
  const status = (params.status || 'ALL') as UserAnimeStatus | 'ALL';
  const genre = params.genre || '';
  const sort = params.sort || 'pop_desc';
  const pageSize = 30;

  // 1. Build Query
  let query = supabase
    .from('animes')
    .select('*', { count: 'exact' })
    .not('ustatus', 'is', null);

  // Filters
  if (status !== 'ALL') query = query.eq('ustatus', status);
  if (search) query = query.ilike('title_romaji', `%${search}%`);
  if (genre) query = query.contains('genres', [genre]);

  // Sorting
  if (sort === 'pop_desc') query = query.order('popularity', { ascending: false });
  else if (sort === 'score_desc') query = query.order('average_score', { ascending: false });
  else if (sort === 'title_asc') query = query.order('title_romaji', { ascending: true });
  else if (sort === 'year_desc') query = query.order('start_date', { ascending: false });

  // Pagination
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  const { data: animeData, count, error } = await query;

  if (error) console.error('Library fetch error:', error);

  const fullList = animeData as Anime[] || [];
  const totalPages = Math.ceil((count || 0) / pageSize);

  // 2. Fetch all unique genres for filter (cached or limited sets)
  const { data: genreData } = await supabase
    .from('animes')
    .select('genres')
    .not('ustatus', 'is', null);

  const allGenres = Array.from(new Set(genreData?.flatMap(a => a.genres || []) || [])).sort();

  return (
    <main className="min-h-screen p-6 md:p-12 space-y-16 max-w-7xl mx-auto pb-32">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 animate-fade-in">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-2 w-10 bg-primary blur-[2px] rounded-full" />
            <h1 className="text-5xl font-black text-white tracking-tighter glow-text">Library Control</h1>
          </div>
          <p className="text-text-muted text-lg font-medium max-w-xl">
            Operational intelligence for your {count || 0}-unit localized repository.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-5 py-2.5 bg-primary/5 border border-primary/20 rounded-2xl text-[10px] font-black tracking-[0.2em] text-primary glow-text flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-primary shadow-[0_0_10px_var(--primary-glow)] animate-pulse" />
            UPLINK_STABLE
          </div>
        </div>
      </header>

      {/* Discovery Tier */}
      {!search && !genre && status === 'ALL' && page === 1 && (
        <div className="space-y-16 animate-fade-in stagger-1">
          <Suspense fallback={<div className="h-[400px] w-full bg-surface/50 rounded-[2.5rem] animate-pulse" />}>
            <Spotlight />
          </Suspense>
          <Suspense fallback={<div className="h-[250px] w-full bg-surface/30 rounded-[2rem] animate-pulse" />}>
            <NeuralSuggestions />
          </Suspense>
        </div>
      )}

      {/* Main Operational Grid */}
      <div className="space-y-12">
        <ClientHome
          initialData={fullList}
          totalHits={count || 0}
          genres={allGenres}
          currentParams={{ page, search, status, genre, sort }}
        />

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          baseUrl="/library"
          searchParams={Object.fromEntries(
            Object.entries(params).filter(([_, v]) => v !== undefined) as [string, string][]
          )}
        />
      </div>

      {fullList.length === 0 && (
        <div className="py-40 text-center glass-card rounded-[3rem] space-y-6">
          <h2 className="text-3xl font-black text-white tracking-tighter">Null Sector Encountered</h2>
          <p className="text-text-muted text-lg font-medium">No archive entries match your current neural filters.</p>
          <Link href="/search" className="inline-block px-10 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest hover:glow-primary transition-all shadow-xl">
            Expand Universal Search
          </Link>
        </div>
      )}
    </main>
  );
}
