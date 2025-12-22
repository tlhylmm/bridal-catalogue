import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.socials}>
                <a href="#" className={styles.link}>Instagram</a>
                <a href="/contact" className={styles.link}>Contact</a>
                <a href="#" className={styles.link}>Pinterest</a>
            </div>
            <p className={styles.copyright}>
                © {new Date().getFullYear()} Gültekin Ataseven. All rights reserved.
            </p>
        </footer>
    );
}
