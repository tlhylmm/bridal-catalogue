import styles from './loading.module.css';

export default function Loading() {
    return (
        <div className={styles.loadingOverlay}>
            <div className={styles.loadingContent}>
                <div className={styles.logoContainer}>
                    <span className={styles.logoText}>GÜLTEKIN ATASEVEN</span>
                </div>
                <div className={styles.spinner}></div>
            </div>
        </div>
    );
}
