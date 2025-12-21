import styles from './page.module.css';
import AppointmentForm from '@/components/AppointmentForm';

export default async function AppointmentPage(props: { searchParams: Promise<{ dress?: string }> }) {
    const searchParams = await props.searchParams;
    const dressSlug = searchParams.dress;
    const initialMessage = dressSlug
        ? `I am interested in booking an appointment to try the '${dressSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}'.`
        : '';

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Book Your Appointment</h1>
            <AppointmentForm initialMessage={initialMessage} />
        </div>
    );
}
