'use server';

import { supabase } from '@/lib/supabaseClient';
import { revalidatePath } from 'next/cache';

export interface RatingData {
    anime_id: number;
    rating: number;
    review?: string;
    watched_episodes?: number;
    is_rewatching?: boolean;
    started_at?: string;
    completed_at?: string;
}

export async function setRating(data: RatingData) {
    try {
        // Validate rating
        if (data.rating < 0 || data.rating > 10) {
            return { error: 'Rating must be between 0 and 10' };
        }

        // Upsert rating in user_ratings table
        const { error: ratingError } = await supabase
            .from('user_ratings')
            .upsert({
                anime_id: data.anime_id,
                rating: data.rating,
                review: data.review || null,
                watched_episodes: data.watched_episodes || 0,
                is_rewatching: data.is_rewatching || false,
                started_at: data.started_at || null,
                completed_at: data.completed_at || null,
                updated_at: new Date().toISOString()
            }, {
                onConflict: 'anime_id'
            });

        if (ratingError) throw ratingError;

        // Update animes table with user rating
        const { error: animeError } = await supabase
            .from('animes')
            .update({
                user_rating: data.rating,
                watched_episodes: data.watched_episodes || 0
            })
            .eq('id', data.anime_id);

        if (animeError) throw animeError;

        revalidatePath(`/anime/${data.anime_id}`);
        revalidatePath('/library');

        return { success: true };
    } catch (e: unknown) {
        console.error('Rating error:', e);
        const errorMessage = e instanceof Error ? e.message : 'Failed to save rating';
        return { error: errorMessage };
    }
}

export async function getRating(animeId: number) {
    try {
        const { data, error } = await supabase
            .from('user_ratings')
            .select('*')
            .eq('anime_id', animeId)
            .single();

        if (error && error.code !== 'PGRST116') throw error;

        return { data: data || null };
    } catch (e: unknown) {
        console.error('Get rating error:', e);
        return { data: null };
    }
}

export async function deleteRating(animeId: number) {
    try {
        // Delete from user_ratings
        const { error: ratingError } = await supabase
            .from('user_ratings')
            .delete()
            .eq('anime_id', animeId);

        if (ratingError) throw ratingError;

        // Clear rating from animes table
        const { error: animeError } = await supabase
            .from('animes')
            .update({
                user_rating: null,
                watched_episodes: 0
            })
            .eq('id', animeId);

        if (animeError) throw animeError;

        revalidatePath(`/anime/${animeId}`);
        revalidatePath('/library');

        return { success: true };
    } catch (e: unknown) {
        console.error('Delete rating error:', e);
        const errorMessage = e instanceof Error ? e.message : 'Failed to delete rating';
        return { error: errorMessage };
    }
}

export async function updateEpisodeProgress(animeId: number, watchedEpisodes: number) {
    try {
        // Update user_ratings
        const { error: ratingError } = await supabase
            .from('user_ratings')
            .update({ watched_episodes: watchedEpisodes })
            .eq('anime_id', animeId);

        if (ratingError) throw ratingError;

        // Update animes table
        const { error: animeError } = await supabase
            .from('animes')
            .update({ watched_episodes: watchedEpisodes })
            .eq('id', animeId);

        if (animeError) throw animeError;

        revalidatePath(`/anime/${animeId}`);
        revalidatePath('/library');

        return { success: true };
    } catch (e: unknown) {
        console.error('Update episode error:', e);
        const errorMessage = e instanceof Error ? e.message : 'Failed to update episodes';
        return { error: errorMessage };
    }
}
