'use server';

import { supabase } from '@/lib/supabaseClient';
import { revalidatePath } from 'next/cache';

interface ExportItem {
    name: string;
    mal?: string;
    al?: string;
}

const STATUS_MAP: Record<string, string> = {
    'To watch': 'TO_WATCH',
    'Planning': 'PLANNING',
    'Dropped': 'DROPPED',
    'On-Hold': 'ON_HOLD',
    'Completed': 'COMPLETED'
};

function getAniListId(url?: string): number | null {
    if (!url) return null;
    const match = url.match(/anilist\.co\/anime\/(\d+)/);
    return match ? parseInt(match[1], 10) : null;
}

export async function smartSyncAction(fileData: Record<string, unknown>) {
    try {
        console.log('Starting Smart Sync Operation...');

        const updates: { id: number, ustatus: string }[] = [];
        const logs: string[] = [];

        for (const category in fileData) {
            const status = STATUS_MAP[category];
            if (!status) continue;

            const items: ExportItem[] = fileData[category] as ExportItem[];

            for (const item of items) {
                const alId = getAniListId(item.al);

                if (alId) {
                    // ID Match - Highest Confidence
                    updates.push({ id: alId, ustatus: status });
                } else {
                    // Name Match - Fallback
                    const { data: nameMatch } = await supabase
                        .from('animes')
                        .select('id')
                        .or(`title_english.ilike.${item.name.replace(/['"]/g, '')},title_romaji.ilike.${item.name.replace(/['"]/g, '')}`)
                        .limit(1)
                        .single();

                    if (nameMatch) {
                        updates.push({ id: nameMatch.id, ustatus: status });
                        logs.push(`Matched "${item.name}" by title`);
                    } else {
                        logs.push(`Could not find "${item.name}" in database`);
                    }
                }
            }
        }

        // Surgical update ustatus
        if (updates.length > 0) {
            console.log(`Processing ${updates.length} surgical updates...`);

            for (const chunk of chunkArray(updates, 20)) {
                await Promise.all(chunk.map(update =>
                    supabase
                        .from('animes')
                        .update({ ustatus: update.ustatus })
                        .eq('id', update.id)
                ));
            }
        }

        // Log the operation
        await supabase.from('system_logs').insert({
            event_type: 'SMART_SYNC',
            description: `Global sync completed: ${updates.length} items updated.`,
            meta: { matched: updates.length, logs: logs.slice(0, 50) }
        });

        revalidatePath('/library');
        revalidatePath('/dashboard');

        return { success: true, count: updates.length };
    } catch (e: any) {
        console.error('Smart Sync Error:', e);
        return { error: e.message };
    }
}

function chunkArray<T>(array: T[], size: number): T[][] {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
    }
    return result;
}
