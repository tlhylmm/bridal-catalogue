import { MetadataRoute } from 'next';
import { createClient } from '@/utils/supabase/server';

// Base URL of the website - update this when deployed
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://gultekinataseven.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const supabase = await createClient();

    // Static pages with their priorities and change frequencies
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: BASE_URL,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1.0, // Homepage is highest priority
        },
        {
            url: `${BASE_URL}/collections`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/sales-points`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${BASE_URL}/from-you`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.6,
        },
        {
            url: `${BASE_URL}/contact`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.5,
        },
    ];

    // Fetch all dresses for dynamic pages
    const { data: dresses } = await supabase
        .from('dresses')
        .select('slug, updated_at')
        .order('created_at', { ascending: false });

    // Generate dress page entries
    const dressPages: MetadataRoute.Sitemap = (dresses || []).map((dress) => ({
        url: `${BASE_URL}/dresses/${dress.slug}`,
        lastModified: dress.updated_at ? new Date(dress.updated_at) : new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.8, // Individual dress pages are high priority
    }));

    // Combine all pages
    return [...staticPages, ...dressPages];
}
