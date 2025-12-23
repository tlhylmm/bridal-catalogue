import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';
import DressGallery from '@/components/DressGallery';

export const dynamic = 'force-dynamic';

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
                            <span className={styles.detailLabel}>Silhouette:</span>
                            <span>{dress.silhouette}</span>
                        </li>
                    )}
                    {dress.fabric && (
                        <li className={styles.detailItem}>
                            <span className={styles.detailLabel}>Fabric:</span>
                            <span>{dress.fabric}</span>
                        </li>
                    )}
                    {dress.neckline && (
                        <li className={styles.detailItem}>
                            <span className={styles.detailLabel}>Neckline:</span>
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
                    Book an Appointment to Try &apos;{dress.name}&apos;
                </Link>
            </div>
        </div>
    )
}
