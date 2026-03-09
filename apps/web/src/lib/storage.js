import { supabase } from './supabase';

/**
 * Uploads a file to Supabase Storage
 * @param {File|string} file - The file object or base64 string
 * @param {string} bucket - The bucket name (default: 'media')
 * @returns {Promise<string>} - The public URL of the uploaded file
 */
export const uploadFile = async (file, bucket = 'media') => {
    try {
        let fileToUpload = file;
        let fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
        let contentType = 'image/jpeg';

        // Handle base64/dataURL strings from imageCompressor
        if (typeof file === 'string' && file.startsWith('data:')) {
            const parts = file.split(';base64,');
            contentType = parts[0].split(':')[1];
            const raw = window.atob(parts[1]);
            const rawLength = raw.length;
            const uInt8Array = new Uint8Array(rawLength);
            for (let i = 0; i < rawLength; ++i) {
                uInt8Array[i] = raw.charCodeAt(i);
            }
            fileToUpload = new Blob([uInt8Array], { type: contentType });

            const extension = contentType.split('/')[1] || 'jpg';
            fileName = `${fileName}.${extension}`;
        } else if (file instanceof File) {
            fileName = `${fileName}-${file.name}`;
            contentType = file.type;
        }

        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(fileName, fileToUpload, {
                contentType,
                cacheControl: '3600',
                upsert: false
            });

        if (error) throw error;

        const { data: publicUrlData } = supabase.storage
            .from(bucket)
            .getPublicUrl(data.path);

        return publicUrlData.publicUrl;
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
};
