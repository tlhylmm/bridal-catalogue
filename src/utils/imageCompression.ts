/**
 * Client-side image compression utility
 * Compresses images before upload to maintain consistent quality/size ratio
 */

export interface CompressOptions {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number; // 0 to 1
}

const DEFAULT_OPTIONS: CompressOptions = {
    maxWidth: 1920,
    maxHeight: 1920,
    quality: 0.85
};

export async function compressImage(file: File, options: CompressOptions = {}): Promise<File> {
    const opts = { ...DEFAULT_OPTIONS, ...options };

    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
            let { width, height } = img;

            // Calculate new dimensions maintaining aspect ratio
            if (width > opts.maxWidth! || height > opts.maxHeight!) {
                const ratio = Math.min(opts.maxWidth! / width, opts.maxHeight! / height);
                width = Math.round(width * ratio);
                height = Math.round(height * ratio);
            }

            canvas.width = width;
            canvas.height = height;

            // Draw image on canvas
            ctx?.drawImage(img, 0, 0, width, height);

            // Convert to blob
            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        // Create new file with original name
                        const compressedFile = new File([blob], file.name, {
                            type: 'image/jpeg',
                            lastModified: Date.now()
                        });
                        resolve(compressedFile);
                    } else {
                        reject(new Error('Failed to compress image'));
                    }
                },
                'image/jpeg',
                opts.quality
            );
        };

        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = URL.createObjectURL(file);
    });
}

export async function compressImages(files: File[], options?: CompressOptions): Promise<File[]> {
    const promises = Array.from(files).map(file => compressImage(file, options));
    return Promise.all(promises);
}
