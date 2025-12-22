'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

// Use proxied URL for 1-year browser caching
const VIDEO_URL = '/api/video/main-landing';

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Attempt to play video when ready
    const video = videoRef.current;
    if (video) {
      video.play().catch(() => {
        // Autoplay might be blocked, that's okay
      });
    }
  }, []);

  return (
    <main>
      <section className={styles.hero}>
        {/* Background Video */}
        <video
          ref={videoRef}
          className={styles.heroVideo}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/hero-poster.jpg"
        >
          <source src={VIDEO_URL} type="video/mp4" />
        </video>

        {/* Content Overlay */}
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
