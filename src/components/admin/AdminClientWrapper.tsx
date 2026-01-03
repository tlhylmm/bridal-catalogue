'use client';

import { ReactNode } from 'react';
import { ToastProvider } from './ToastProvider';

export default function AdminClientWrapper({ children }: { children: ReactNode }) {
    return (
        <ToastProvider>
            {children}
        </ToastProvider>
    );
}
