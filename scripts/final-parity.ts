import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!);

const STATUS_MAP: Record<string, string> = {
    'To watch': 'TO_WATCH',
    'Planning': 'PLANNING',
    'Dropped': 'DROPPED',
    'On-Hold': 'ON_HOLD',
    'Completed': 'COMPLETED',
    'Watching': 'WATCHING'
};

async function executeAbsoluteParity() {
    console.log('--- MISSION: ABSOLUTE_PARITY ---');
    const exportData = JSON.parse(fs.readFileSync('export.json', 'utf8'));
    const targets = [];

    for (const [category, items] of Object.entries(exportData)) {
        const status = STATUS_MAP[category];
        for (const item of (items as any[])) {
            const alId = item.al ? parseInt(item.al.split('/').filter(Boolean).pop()) : null;
            if (alId) {
                targets.push({ id: alId, status });
            }
        }
    }

    console.log(`Synchronizing ${targets.length} units into dual-archive repositories...`);

    // Wipe legacy list for clean state
    await supabase.from('user_anime_lists').delete().neq('anime_id', 0);

    for (const target of targets) {
        // 1. Update primary Millennium Archive
        await supabase.from('animes').update({ ustatus: target.status }).eq('id', target.id);

        // 2. Populate legacy repository
        await supabase.from('user_anime_lists').insert({
            anime_id: target.id,
            status: target.status
        });
    }

    const { count: uCount } = await supabase.from('animes').select('*', { count: 'exact', head: true }).not('ustatus', 'is', null);
    const { count: lCount } = await supabase.from('user_anime_lists').select('*', { count: 'exact', head: true });

    console.log(`MISSION_COMPLETE. Final Index: ${uCount}. Legacy Index: ${lCount}.`);
}

executeAbsoluteParity();
