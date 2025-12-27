'use server';

import { supabase } from '@/lib/supabaseClient';
import { calculateDiff, DiffItem, ImportData } from '@/lib/diffEngine';
import { revalidatePath } from 'next/cache';

// Max file size for safety
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const ANILIST_QUERY = `
    query ($id: Int) {
      Media(id: $id, type: ANIME) {
        id
        idMal
        title { romaji english native }
        description
        bannerImage
        coverImage { extraLarge large medium }
        startDate { year month day }
        endDate { year month day }
        status
        episodes
        duration
        genres
        averageScore
        studios { nodes { name } }
        source
        siteUrl
        format
        season
        seasonYear
        popularity
        favourites
      }
    }
`;

export async function uploadAndDiff(formData: FormData) {
    const file = formData.get('file') as File;

    if (!file) return { error: 'No file uploaded' };
    if (file.size > MAX_FILE_SIZE) return { error: 'File too large' };

    try {
        const text = await file.text();
        const json: Record<string, ImportData[]> = JSON.parse(text);

        // Fetch DB State
        const { data: dbAnimes } = await supabase.from('animes').select('*');
        const { data: dbList } = await supabase.from('user_anime_lists').select('anime_id, status');

        if (!dbAnimes || !dbList) return { error: 'Database fetch failed' };

        // Calculate Diff
        // @ts-ignore
        const diffs = calculateDiff(json, dbAnimes, dbList);

        // Log the Scan
        await supabase.from('system_logs').insert({
            event_type: 'IMPORT_SCAN',
            description: `Scanned ${file.name}. Found ${diffs.length} changes.`,
            meta: { diff_count: diffs.length }
        });

        return { success: true, diffs };
    } catch (e) {
        console.error(e);
        return { error: 'Invalid JSON or parsing error' };
    }
}

export async function applyChange(diff: DiffItem) {
    try {
        if (diff.type === 'NEW') {
            // 1. Full Scrape from AniList
            const richData = await fetchAniList(diff.id);
            if (!richData) return { error: 'Failed to fetch data from AniList' };

            // 2. Dual-Archive Ingestion
            // Update primary Millennium Archive
            const { error: animeError } = await supabase.from('animes').upsert({
                ...richData,
                ustatus: diff.newStatus
            });
            if (animeError) throw new Error('Millennium Archive Error: ' + animeError.message);

            // Update legacy repository
            await supabase.from('user_anime_lists').delete().eq('anime_id', diff.id);
            const { error: listError } = await supabase.from('user_anime_lists').insert({
                anime_id: diff.id,
                status: diff.newStatus
            });
            if (listError) throw new Error('Legacy Repository Error: ' + listError.message);

        } else if (diff.type === 'STATUS_CHANGE') {
            // 1. Update Millennium Archive
            const { error: animeError } = await supabase.from('animes').update({
                ustatus: diff.newStatus
            }).eq('id', diff.id);
            if (animeError) throw new Error('Millennium Archive Update Error: ' + animeError.message);

            // 2. Update Legacy Repository
            await supabase.from('user_anime_lists').delete().eq('anime_id', diff.id);
            await supabase.from('user_anime_lists').insert({
                anime_id: diff.id,
                status: diff.newStatus
            });
        }

        // Log Mission Event
        await supabase.from('system_logs').insert({
            event_type: 'SYNC_PROTOCOL',
            description: `Synchronized ${diff.type} for ID ${diff.id} [${diff.title}]`,
            meta: diff
        });

        revalidatePath('/dashboard');
        revalidatePath('/');
        revalidatePath('/library');
        return { success: true };

    } catch (e: any) {
        console.error(e);
        return { error: e.message || 'Mission Failure' };
    }
}

async function fetchAniList(id: number) {
    try {
        const res = await fetch('https://graphql.anilist.co', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: ANILIST_QUERY, variables: { id } })
        });

        const json = await res.json();
        const media = json.data?.Media;

        if (!media) return null;

        return {
            id: media.id,
            title_romaji: media.title.romaji,
            title_english: media.title.english || media.title.romaji,
            title_native: media.title.native,
            description: media.description,
            banner_image: media.bannerImage,
            cover_image: media.coverImage.extraLarge || media.coverImage.large,
            start_date: formatDate(media.startDate),
            end_date: formatDate(media.endDate),
            status: media.status,
            episodes: media.episodes,
            duration: media.duration,
            genres: media.genres,
            average_score: media.averageScore,
            studios: media.studios?.nodes?.map((s: any) => s.name) || [],
            source: media.source,
            mal_id: media.idMal,
            anilist_url: media.siteUrl,
            format: media.format,
            season: media.season,
            season_year: media.seasonYear,
            popularity: media.popularity,
            favourites: media.favourites
        };
    } catch (e) {
        console.error("Scrape failed:", e);
        return null;
    }
}

function formatDate(date: any) {
    if (!date?.year) return null;
    return `${date.year}-${String(date.month || 1).padStart(2, '0')}-${String(date.day || 1).padStart(2, '0')}`;
}
