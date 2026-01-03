import { Metadata } from 'next';
import { createClient } from '@/utils/supabase/server';
import SalesPointsClient from '@/components/SalesPointsClient';

export const metadata: Metadata = {
    title: 'Satış Noktaları | Gültekin Ataseven',
    description: 'Gültekin Ataseven gelinlik satış noktalarını keşfedin. Türkiye genelindeki mağazalarımızda gelinliklerimizi deneyebilirsiniz.',
    keywords: ['satış noktası', 'mağaza', 'gültekin ataseven', 'gelinlik mağazası', 'bridal store'],
    openGraph: {
        title: 'Satış Noktaları | Gültekin Ataseven',
        description: 'Türkiye genelindeki mağazalarımızda gelinliklerimizi deneyebilirsiniz.',
        images: ['/og-image.jpg'],
        type: 'website',
    },
};

export const dynamic = 'force-dynamic';

export default async function SalesPointsPage() {
    const supabase = await createClient();

    const { data: salesPoints } = await supabase
        .from('sales_points')
        .select('*')
        .order('name', { ascending: true });

    return (
        <SalesPointsClient salesPoints={salesPoints || []} />
    );
}
