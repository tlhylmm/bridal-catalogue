import { MetadataRoute } from 'next';

// Base URL of the website - update this when deployed
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://gultekinataseven.com';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/admin',      // Block admin panel from crawlers
                    '/admin/*',    // Block all admin sub-pages
                    '/api/',       // Block API routes
                    '/login',      // Block login page
                ],
            },
        ],
        sitemap: `${BASE_URL}/sitemap.xml`,
    };
}
