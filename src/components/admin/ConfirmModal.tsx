'use client';

import { useState } from 'react';
import styles from './ConfirmModal.module.css';

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    isLoading?: boolean;
    isWarning?: boolean;
}

export default function ConfirmModal({
    isOpen,
    title,
    message,
    confirmText = 'Sil',
    cancelText = 'İptal',
    onConfirm,
    onCancel,
    isLoading = false,
    isWarning = false
}: ConfirmModalProps) {
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onCancel}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.title}>{title}</div>
                <div className={`${styles.message} ${isWarning ? styles.warning : ''}`}>
                    {message}
                </div>
                <div className={styles.buttons}>
                    <button
                        className={styles.cancelBtn}
                        onClick={onCancel}
                        disabled={isLoading}
                    >
                        {cancelText}
                    </button>
                    <button
                        className={styles.confirmBtn}
                        onClick={onConfirm}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Siliniyor...' : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
