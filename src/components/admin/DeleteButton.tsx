'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteCollection } from '@/actions/collectionActions';
import { deleteDress } from '@/actions/dressActions';
import { deleteSalesPoint } from '@/actions/salesPointActions';
import ConfirmModal from './ConfirmModal';

interface DeleteButtonProps {
    itemName?: string;
}

export default function DeleteButton({ itemName = 'this item' }: DeleteButtonProps) {
    // This is the old form-based button, kept for backward compatibility
    return (
        <button
            type="submit"
            className="admin-btn admin-btn-danger"
        >
            Sil
        </button>
    );
}

interface DeleteCollectionButtonProps {
    collectionId: string;
    collectionName: string;
    dressCount: number;
}

export function DeleteCollectionButton({ collectionId, collectionName, dressCount }: DeleteCollectionButtonProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        setIsLoading(true);
        try {
            const result = await deleteCollection(collectionId);

            if (result.success) {
                setIsModalOpen(false);
                router.refresh();
            } else {
                alert(`Hata: ${result.error}`);
            }
        } catch (err: unknown) {
            console.error('Koleksiyon silinirken hata:', err);
            alert('Koleksiyon silinirken bir hata oluştu!');
        } finally {
            setIsLoading(false);
        }
    };

    const message = dressCount > 0
        ? `Bu koleksiyonu silmek aynı zamanda ${dressCount} gelinliği ve tüm fotoğraflarını silecek.\n\nBu işlem geri alınamaz. Emin misiniz?`
        : `"${collectionName}" koleksiyonunu silmek istediğinize emin misiniz?`;

    return (
        <>
            <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="admin-btn admin-btn-danger"
            >
                Sil
            </button>
            <ConfirmModal
                isOpen={isModalOpen}
                title="Koleksiyonu Sil"
                message={message}
                onConfirm={handleDelete}
                onCancel={() => setIsModalOpen(false)}
                isLoading={isLoading}
                isWarning={dressCount > 0}
            />
        </>
    );
}

interface DeleteDressButtonProps {
    dressId: string;
    dressName: string;
}

export function DeleteDressButton({ dressId, dressName }: DeleteDressButtonProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        setIsLoading(true);
        try {
            const result = await deleteDress(dressId);

            if (result.success) {
                setIsModalOpen(false);
                router.refresh();
            } else {
                alert(`Hata: ${result.error}`);
            }
        } catch (err: unknown) {
            console.error('Gelinlik silinirken hata:', err);
            alert('Gelinlik silinirken bir hata oluştu!');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="admin-btn admin-btn-danger"
            >
                Sil
            </button>
            <ConfirmModal
                isOpen={isModalOpen}
                title="Gelinliği Sil"
                message={`"${dressName}" gelinliğini silmek istediğinize emin misiniz?\n\nBu işlem geri alınamaz.`}
                onConfirm={handleDelete}
                onCancel={() => setIsModalOpen(false)}
                isLoading={isLoading}
            />
        </>
    );
}

interface DeleteSalesPointButtonProps {
    salesPointId: string;
    salesPointName: string;
}

export function DeleteSalesPointButton({ salesPointId, salesPointName }: DeleteSalesPointButtonProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        setIsLoading(true);
        try {
            const result = await deleteSalesPoint(salesPointId);

            if (result.success) {
                setIsModalOpen(false);
                router.refresh();
            } else {
                alert(`Hata: ${result.error}`);
            }
        } catch (err: unknown) {
            console.error('Satış noktası silinirken hata:', err);
            alert('Satış noktası silinirken bir hata oluştu!');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="admin-btn admin-btn-danger"
            >
                Sil
            </button>
            <ConfirmModal
                isOpen={isModalOpen}
                title="Satış Noktasını Sil"
                message={`"${salesPointName}" satış noktasını silmek istediğinize emin misiniz?\n\nBu işlem geri alınamaz.`}
                onConfirm={handleDelete}
                onCancel={() => setIsModalOpen(false)}
                isLoading={isLoading}
            />
        </>
    );
}
