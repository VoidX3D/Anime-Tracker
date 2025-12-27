
import { createClient } from '@supabase/supabase-js';
import { GraphQLClient, gql } from 'graphql-request';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const ANILIST_API_URL = 'https://graphql.anilist.co';

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
const gqlClient = new GraphQLClient(ANILIST_API_URL);

// --- Status Mapping Helpers ---
const STATUS_MAP: Record<string, string> = {
    'To watch': 'TO_WATCH',
    'Planning': 'PLANNING',
    'Dropped': 'DROPPED',
    'On-Hold': 'ON_HOLD',
    'Completed': 'COMPLETED'
};

function getAniListId(url: string | null): number | null {
    if (!url) return null;
    const match = url.match(/anilist\.co\/anime\/(\d+)/);
    return match ? parseInt(match[1], 10) : null;
}

const SCRAPE_QUERY = gql`
  query ($page: Int) {
    Page(page: $page, perPage: 50) {
      pageInfo {
        hasNextPage
        total
      }
      media(type: ANIME, sort: ID) {
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
        popularity
        favourites
        studios(isMain: true) { nodes { name } }
        source
        siteUrl
        format
        season
        seasonYear
        isAdult
        relations {
          edges {
            relationType
            node {
              id
              title { romaji english }
              coverImage { medium }
              status
              format
              season
              seasonYear
            }
          }
        }
      }
    }
  }
`;

function formatDate(date: { year: number; month: number; day: number }): string | null {
    if (!date || !date.year) return null;
    return `${date.year}-${String(date.month || 1).padStart(2, '0')}-${String(date.day || 1).padStart(2, '0')}`;
}

async function fetchPage(page: number, userStatusMap: Record<number, string>) {
    const RAW_DIR = path.join(process.cwd(), 'data/raw');

    try {
        const data: any = await gqlClient.request(SCRAPE_QUERY, { page });
        const mediaList = data.Page.media;

        if (!mediaList || mediaList.length === 0) return { success: true, count: 0, hasNext: false };

        // 1. Save Raw JSON to Disk
        fs.writeFileSync(path.join(RAW_DIR, `page_${page}.json`), JSON.stringify(mediaList, null, 2));

        // 2. Map to DB Schema
        const animeItems = mediaList.map((m: any) => {
            const item: any = {
                id: m.id,
                title_romaji: m.title.romaji,
                title_english: m.title.english || m.title.romaji,
                title_native: m.title.native,
                description: m.description,
                banner_image: m.bannerImage,
                cover_image: m.coverImage.extraLarge || m.coverImage.large,
                start_date: formatDate(m.startDate),
                end_date: formatDate(m.endDate),
                status: m.status,
                episodes: m.episodes,
                duration: m.duration,
                genres: m.genres,
                average_score: m.averageScore,
                popularity: m.popularity,
                favourites: m.favourites,
                studios: m.studios.nodes.map((s: any) => s.name),
                source: m.source,
                mal_id: m.idMal,
                anilist_url: m.siteUrl,
                format: m.format,
                season: m.season,
                season_year: m.seasonYear,
                is_adult: m.isAdult,
                relations: m.relations?.edges?.map((e: any) => ({
                    id: e.node.id,
                    type: e.relationType,
                    title: e.node.title.english || e.node.title.romaji,
                    image: e.node.coverImage.medium,
                    status: e.node.status,
                    format: e.node.format,
                    season: e.node.season,
                    season_year: e.node.seasonYear
                })) || [],
                raw_data: m
            };

            // ONLY update ustatus if present in export.json
            // This protects manually added items from being wiped by the global scraper
            if (userStatusMap[m.id]) {
                item.ustatus = userStatusMap[m.id];
            }

            return item;
        });

        // 3. Upsert to Supabase
        const { error } = await supabase.from('animes').upsert(animeItems, { onConflict: 'id' });
        if (error) throw error;

        return { success: true, count: animeItems.length, hasNext: data.Page.pageInfo.hasNextPage };
    } catch (err: any) {
        return { success: false, error: err.message, page };
    }
}

async function scrape() {
    const RAW_DIR = path.join(process.cwd(), 'data/raw');
    if (!fs.existsSync(RAW_DIR)) fs.mkdirSync(RAW_DIR, { recursive: true });

    // Load user list for matching
    const exportPath = path.join(process.cwd(), 'export.json');
    const userStatusMap: Record<number, string> = {};
    if (fs.existsSync(exportPath)) {
        try {
            const jsonData = JSON.parse(fs.readFileSync(exportPath, 'utf-8'));
            for (const cat in jsonData) {
                const status = STATUS_MAP[cat] || 'UNKNOWN';
                jsonData[cat].forEach((item: any) => {
                    const id = getAniListId(item.al);
                    if (id) userStatusMap[id] = status;
                });
            }
        } catch (e) { }
    }

    // Resume logic
    const cachedFiles = fs.readdirSync(RAW_DIR).filter(f => f.startsWith('page_') && f.endsWith('.json'));
    let startPage = 1;
    if (cachedFiles.length > 0) {
        startPage = Math.max(...cachedFiles.map(f => parseInt(f.replace('page_', '').replace('.json', '')))) + 1;
    }

    console.log(`🚀 BRUTE FORCE ARCHIVE STARTing at Page ${startPage}`);
    console.log(`⚠️  Ignoring standard limit protocols as per directive.`);

    let currentPage = startPage;
    let hasMore = true;
    const CONCURRENCY = 2; // Reduced for sustained throughput without constant 429s

    while (hasMore) {
        const batch = [];
        for (let i = 0; i < CONCURRENCY; i++) {
            batch.push(fetchPage(currentPage + i, userStatusMap));
        }

        console.log(`📡 Fetching pages ${currentPage} to ${currentPage + CONCURRENCY - 1}...`);
        const results = await Promise.all(batch);

        for (const res of results) {
            if (!res.success) {
                console.error(`  ❌ Error Page ${(res as any).page}: ${(res as any).error}`);
                if ((res as any).error.includes('429')) {
                    console.log(`  🕒 Rate limit hit. Cooling down 15s...`);
                    await new Promise(r => setTimeout(r, 15000));
                }
            } else {
                if (!res.hasNext) hasMore = false;
                console.log(`  ✅ Page synced (${res.count} items)`);
            }
        }

        currentPage += CONCURRENCY;
        // Moderate delay
        await new Promise(r => setTimeout(r, 1500));
    }

    console.log('\n💎 BRUTE FORCE ARCHIVE COMPLETE.');
}

scrape();
