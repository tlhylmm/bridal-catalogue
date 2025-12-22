import styles from './page.module.css';
import ContactForm from '@/components/ContactForm';

export default function ContactPage() {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Contact Us</h1>
            <p className={styles.subtitle}>
                We&apos;d love to hear from you. Reach out to us with any questions or inquiries.
            </p>

            {/* Contact Info */}
            <div className={styles.contactInfo}>
                <div className={styles.contactItem}>
                    <span className={styles.contactIcon}>✉</span>
                    <div>
                        <h3 className={styles.contactLabel}>Email</h3>
                        <a href="mailto:info@gultekin.com" className={styles.contactLink}>
                            info@gultekin.com
                        </a>
                    </div>
                </div>
                <div className={styles.contactItem}>
                    <span className={styles.contactIcon}>✆</span>
                    <div>
                        <h3 className={styles.contactLabel}>Phone</h3>
                        <a href="tel:+905551234567" className={styles.contactLink}>
                            +90 555 123 45 67
                        </a>
                    </div>
                </div>
            </div>

            {/* Divider */}
            <div className={styles.divider}>
                <span>or send us a message</span>
            </div>

            {/* Contact Form */}
            <ContactForm />
        </div>
    );
}
