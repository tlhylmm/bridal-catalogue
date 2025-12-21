import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  return (
    <main>
      <section
        className={styles.hero}
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1546193430-c2d207739ed7?q=80&w=2696&auto=format&fit=crop")' }}
      >
        <div className={styles.overlay}>
          <h1 className={styles.headline}>
            Timeless Elegance for<br />the Modern Bride.
          </h1>
          <Link href="/collections" className={styles.ctaButton}>
            Explore the 2024 Collection
          </Link>
        </div>
      </section>

      {/* TODO: Featured Collection Section */}
    </main>
  );
}
