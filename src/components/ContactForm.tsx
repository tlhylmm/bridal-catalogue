'use client';

import { useState } from 'react';
import styles from '../app/(public)/contact/page.module.css';

export default function ContactForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Build email body
        const emailBody = `Name: ${name}
Email: ${email}
Phone: ${phone}

Message:
${message}`;

        // Create mailto link
        const subject = encodeURIComponent('Contact Inquiry - Gültekin Ataseven');
        const body = encodeURIComponent(emailBody);

        window.location.href = `mailto:info@gultekin.com?subject=${subject}&body=${body}`;
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.row}>
                <div className={styles.inputGroup}>
                    <label htmlFor="name" className={styles.label}>Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        className={styles.input}
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="email" className={styles.label}>Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        className={styles.input}
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
            </div>

            <div className={styles.inputGroup}>
                <label htmlFor="phone" className={styles.label}>Phone (optional)</label>
                <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className={styles.input}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />
            </div>

            <div className={styles.inputGroup}>
                <label htmlFor="message" className={styles.label}>Message</label>
                <textarea
                    id="message"
                    name="message"
                    className={styles.textarea}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="How can we help you?"
                ></textarea>
            </div>

            <button type="submit" className={styles.submitButton}>
                Send Message
            </button>
        </form>
    );
}
