import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import fetch from 'node-fetch';

dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!);

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

const STATUS_MAP: Record<string, string> = {
    'To watch': 'TO_WATCH',
    'Planning': 'PLANNING',
    'Dropped': 'DROPPED',
    'On-Hold': 'ON_HOLD',
    'Completed': 'COMPLETED',
    'Watching': 'WATCHING'
};

async function fetchAniList(id: number) {
    for (let attempt = 0; attempt < 3; attempt++) {
        try {
            const res = await fetch('https://graphql.anilist.co', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: ANILIST_QUERY, variables: { id } })
            });
            const json: any = await res.json();

            if (res.status === 429) {
                console.log(`Rate limited on attempt ${attempt + 1}. Waiting 60s...`);
                await new Promise(r => setTimeout(r, 60000));
                continue;
            }

            const media = json.data?.Media;
            if (!media) return null;

            const formatDate = (date: any) => {
                if (!date?.year) return null;
                return `${date.year}-${String(date.month || 1).padStart(2, '0')}-${String(date.day || 1).padStart(2, '0')}`;
            };

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
            console.error(`Fetch error for ${id}:`, e);
            await new Promise(r => setTimeout(r, 5000));
        }
    }
    return null;
}

async function startFinalExtraction() {
    console.log('--- MISSION: FINAL_EXTRACTION ---');
    const exportData = JSON.parse(fs.readFileSync('export.json', 'utf8'));
    let missing = [];

    for (const [category, items] of Object.entries(exportData)) {
        const ustatus = STATUS_MAP[category];
        for (const item of (items as any[])) {
            const alId = item.al ? parseInt(item.al.split('/').filter(Boolean).pop()) : null;
            if (alId) {
                const { data } = await supabase.from('animes').select('id').eq('id', alId).single();
                if (!data) {
                    missing.push({ id: alId, ustatus, name: item.name });
                }
            }
        }
    }

    console.log(`Extraction targets: ${missing.length}. High Intensity Fetch Initiated.`);

    for (const entry of missing) {
        process.stdout.write(`Fetching ${entry.name}... `);
        const richData = await fetchAniList(entry.id);
        if (richData) {
            await supabase.from('animes').upsert({ ...richData, ustatus: entry.ustatus });
            await supabase.from('user_anime_lists').insert({ anime_id: entry.id, status: entry.ustatus });
            console.log('SUCCESS');
        } else {
            console.log('FAILED');
        }
        // Strict cooldown
        await new Promise(r => setTimeout(r, 2000));
    }

    console.log('--- EXTRACTION_COMPLETE ---');
}

startFinalExtraction();
