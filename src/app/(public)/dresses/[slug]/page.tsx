import { Metadata } from 'next';
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';
import DressGallery from '@/components/DressGallery';

export const dynamic = 'force-dynamic';

// Generate dynamic metadata for each dress
export async function generateMetadata(
    props: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
    const params = await props.params;
    const supabase = await createClient();

    const { data: dress } = await supabase
        .from('dresses')
        .select('name, description, main_image')
        .eq('slug', params.slug)
        .single();

    if (!dress) {
        return {
            title: 'Gelinlik Bulunamadı | Gültekin Ataseven',
        };
    }

    const description = dress.description
        ? dress.description.substring(0, 160)
        : `${dress.name} gelinlik modeli. Gültekin Ataseven'de bu zarif tasarımı keşfedin.`;

    return {
        title: `${dress.name} | Gültekin Ataseven Gelinlik`,
        description: description,
        keywords: [dress.name, 'gelinlik', 'gültekin ataseven', 'wedding dress', 'bridal'],
        openGraph: {
            title: `${dress.name} | Gültekin Ataseven`,
            description: description,
            images: dress.main_image ? [dress.main_image] : [],
            type: 'website',
        },
    };
}

export default async function DressPage(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;
    const supabase = await createClient();

    const { data: dress } = await supabase
        .from('dresses')
        .select('*')
        .eq('slug', params.slug)
        .single();

    if (!dress) {
        notFound();
    }

    const galleryImages: string[] = dress.gallery_images || [];

    return (
        <div className={styles.container}>
            {/* Gallery Section */}
            <DressGallery
                mainImage={dress.main_image || ''}
                galleryImages={galleryImages}
                dressName={dress.name}
            />

            {/* Info Section */}
            <div className={styles.info}>
                <h1 className={styles.title}>{dress.name}</h1>

                <ul className={styles.detailsList}>
                    {dress.silhouette && (
                        <li className={styles.detailItem}>
                            <span className={styles.detailLabel}>Silüet:</span>
                            <span>{dress.silhouette}</span>
                        </li>
                    )}
                    {dress.fabric && (
                        <li className={styles.detailItem}>
                            <span className={styles.detailLabel}>Kumaş:</span>
                            <span>{dress.fabric}</span>
                        </li>
                    )}
                    {dress.neckline && (
                        <li className={styles.detailItem}>
                            <span className={styles.detailLabel}>Yaka:</span>
                            <span>{dress.neckline}</span>
                        </li>
                    )}
                </ul>

                {dress.description && (
                    <p className={styles.description}>
                        {dress.description}
                    </p>
                )}


                <Link href={`/appointment?dress=${dress.slug}`} className={styles.bookButton}>
                    &apos;{dress.name}&apos; denemek için randevu alın
                </Link>
            </div>
        </div>
    )
}
