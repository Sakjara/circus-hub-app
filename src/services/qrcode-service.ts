import QRCode from 'qrcode';

export const QRCodeService = {
    /**
     * Generates a QR Code Data URL from the given text (Order ID).
     * @param text The string to encode (e.g. Order ID + Hash)
     * @returns Promise resolving to a Data URL string (image/png)
     */
    async generateQRCode(text: string): Promise<string> {
        try {
            // Generate QR Code as Data URL
            const dataUrl = await QRCode.toDataURL(text, {
                width: 300,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#ffffff',
                },
            });
            return dataUrl;
        } catch (err) {
            console.error('Error generating QR code', err);
            throw err;
        }
    },
};
