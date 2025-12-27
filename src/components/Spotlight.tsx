import { supabase } from '@/lib/supabaseClient';
import { Anime } from '@/types';
import SpotlightCarousel from './SpotlightCarousel';

export default async function Spotlight() {
    // Fetch top 5 trending anime (highest popularity with scores > 70)
    const { data: trending } = await supabase
        .from('animes')
        .select('*')
        .not('banner_image', 'is', null)
        .gte('average_score', 75)
        .order('popularity', { ascending: false })
        .limit(5);

    if (!trending || trending.length === 0) return null;

    return <SpotlightCarousel items={trending as Anime[]} />;
}
