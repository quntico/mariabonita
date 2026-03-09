export const compressImage = (file, maxWidth = 1200, quality = 0.7) => {
    return new Promise((resolve, reject) => {
        if (!file) return reject("No file provided");

        // Timeout fall-back para evitar cuelgues (10 segundos)
        const timeout = setTimeout(() => {
            reject(new Error("Timeout: No se pudo comprimir la imagen."));
        }, 10000);

        const reader = new FileReader();

        reader.onload = (event) => {
            const img = new Image();

            img.onload = () => {
                clearTimeout(timeout);
                let width = img.width;
                let height = img.height;

                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');

                ctx.drawImage(img, 0, 0, width, height);

                // Convertir a WebP con compresión para ahorrar MUCHO espacio en localStorage
                const dataUrl = canvas.toDataURL('image/webp', quality);
                resolve(dataUrl);
            };

            img.onerror = () => {
                clearTimeout(timeout);
                reject(new Error("Formato de imagen no soportado o archivo corrupto."));
            };

            img.src = event.target.result;
        };

        reader.onerror = () => {
            clearTimeout(timeout);
            reject(new Error("Error leyendo el archivo."));
        };

        reader.readAsDataURL(file);
    });
};
