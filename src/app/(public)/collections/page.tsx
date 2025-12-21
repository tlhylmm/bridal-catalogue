import { createClient } from '@/utils/supabase/server';
import CollectionsClient from '@/components/CollectionsClient';

export const dynamic = 'force-dynamic';

export default async function CollectionsPage(props: { searchParams: Promise<{ category?: string }> }) {
    const searchParams = await props.searchParams;
    const categorySlug = searchParams.category;

    const supabase = await createClient();

    // Fetch all collections
    const { data: collections } = await supabase
        .from('collections')
        .select('*')
        .order('name', { ascending: true });

    // Fetch ALL dresses (no filter - filtering is done client-side)
    const { data: dresses } = await supabase
        .from('dresses')
        .select('*')
        .order('created_at', { ascending: false });

    return (
        <CollectionsClient
            collections={collections || []}
            dresses={dresses || []}
            initialCategory={categorySlug}
        />
    );
}
