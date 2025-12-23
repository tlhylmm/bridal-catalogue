import styles from './page.module.css';
import AppointmentForm from '@/components/AppointmentForm';

export default async function AppointmentPage(props: { searchParams: Promise<{ dress?: string }> }) {
    const searchParams = await props.searchParams;
    const dressSlug = searchParams.dress;
    const initialMessage = dressSlug
        ? `Merhaba, '${dressSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}' için randevu almak istiyorum.`
        : '';

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Randevu Alın</h1>
            <AppointmentForm initialMessage={initialMessage} />
        </div>
    );
}
