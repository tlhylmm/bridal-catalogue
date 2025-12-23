import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.socials}>
                <a href="https://www.instagram.com/gultekinmodaevi/" className={styles.link}>Instagram</a>
                <a href="https://www.facebook.com/GultekinModaEvi/" className={styles.link}>Facebook</a>
                <a href="/contact" className={styles.link}>İletişim</a>
            </div>
            <p className={styles.copyright}>
                © {new Date().getFullYear()} Gültekin Ataseven. Tüm Hakları Saklıdır.
            </p>
        </footer>
    );
}
