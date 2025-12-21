import { createClient } from '@/utils/supabase/server';
import styles from './page.module.css';
import FromYouGallery from '@/components/FromYouGallery';

export const dynamic = 'force-dynamic';

export default async function FromYouPage() {
    const supabase = await createClient();

    const { data: images } = await supabase
        .from('from_you_images')
        .select('*')
        .order('created_at', { ascending: false });

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>From You</h1>
            <p className={styles.subtitle}>
                Beautiful moments shared by our brides
            </p>

            {images && images.length > 0 ? (
                <FromYouGallery images={images} />
            ) : (
                <p className={styles.empty}>
                    No photos yet. Be the first to share your moment!
                </p>
            )}
        </div>
    );
}
