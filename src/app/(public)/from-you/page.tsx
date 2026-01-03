import { Metadata } from 'next';
import { createClient } from '@/utils/supabase/server';
import styles from './page.module.css';
import FromYouGallery from '@/components/FromYouGallery';

export const metadata: Metadata = {
    title: 'Sizden Gelenler | Gültekin Ataseven',
    description: 'Gelinlerimizin paylaştığı güzel anlar. Gültekin Ataseven gelinliklerini giyen mutlu gelinlerimizin fotoğrafları.',
    keywords: ['gelin fotoğrafları', 'müşteri yorumları', 'gültekin ataseven', 'gelinlik', 'bride photos'],
    openGraph: {
        title: 'Sizden Gelenler | Gültekin Ataseven',
        description: 'Mutlu gelinlerimizin fotoğrafları.',
        images: ['/og-image.jpg'],
        type: 'website',
    },
};

export const dynamic = 'force-dynamic';

export default async function FromYouPage() {
    const supabase = await createClient();

    const { data: images } = await supabase
        .from('from_you_images')
        .select('*')
        .order('created_at', { ascending: false });

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Sizden Gelenler</h1>
            <p className={styles.subtitle}>
                Gelinlerimizin paylaştığı güzel anlar
            </p>

            {images && images.length > 0 ? (
                <FromYouGallery images={images} />
            ) : (
                <p className={styles.empty}>
                    Burada henüz bir fotoğraf yok.
                </p>
            )}
        </div>
    );
}
