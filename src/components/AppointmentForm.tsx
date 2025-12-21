'use client';

import { useState } from 'react';
import styles from '../app/(public)/appointment/page.module.css';

interface AppointmentFormProps {
    initialMessage?: string;
}

export default function AppointmentForm({ initialMessage = '' }: AppointmentFormProps) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [date, setDate] = useState('');
    const [message, setMessage] = useState(initialMessage);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Build email body
        const emailBody = `Name: ${name}
Email: ${email}
Phone: ${phone}
Preferred Date: ${date}

Message:
${message}`;

        // Create mailto link
        const subject = encodeURIComponent('Appointment Request - Gültekin Ataseven');
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

            <div className={styles.row}>
                <div className={styles.inputGroup}>
                    <label htmlFor="phone" className={styles.label}>Phone</label>
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
                    <label htmlFor="date" className={styles.label}>Preferred Date</label>
                    <input
                        type="date"
                        id="date"
                        name="date"
                        className={styles.input}
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>
            </div>

            <div className={styles.inputGroup}>
                <label htmlFor="message" className={styles.label}>Message</label>
                <textarea
                    id="message"
                    name="message"
                    className={styles.textarea}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                ></textarea>
            </div>

            <button type="submit" className={styles.submitButton}>
                Request Appointment
            </button>
        </form>
    );
}
