import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';

export interface TicketData {
    orderId: string;
    orderDate: Date;
    customerEmail: string;
    customerName: string;
    showName: string;
    venueName: string;
    venueAddress: string;
    eventDate: Date;
    eventTime: string;
    seats: Array<{
        section: string;
        row: string;
        seatNumber: number;
        ticketType: 'adult' | 'child' | 'promo';
        price: number;
    }>;
    subtotal: number;
    fees: number;
    total: number;
    paymentMethod: {
        type: string;
        last4: string;
    };
    qrCodeData: string;
}

export async function generateTicketPDF(ticketData: TicketData): Promise<void> {
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    let yPosition = margin;

    // Helper function to add section separator
    const addSeparator = () => {
        yPosition += 5;
        doc.setDrawColor(200, 200, 200);
        doc.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 8;
    };

    // ===== HEADER SECTION =====
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 67, 176); // Garden Bros blue
    doc.text('GARDEN BROS CIRCUS', pageWidth / 2, yPosition, { align: 'center' });

    yPosition += 8;
    doc.setFontSize(14);
    doc.setTextColor(100, 100, 100);
    doc.text('TICKET CONFIRMATION', pageWidth / 2, yPosition, { align: 'center' });

    yPosition += 3;
    addSeparator();

    // ===== QR CODE SECTION =====
    try {
        const qrCodeDataUrl = await QRCode.toDataURL(ticketData.qrCodeData, {
            width: 400,
            margin: 1,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            }
        });

        const qrSize = 60;
        const qrX = (pageWidth - qrSize) / 2;
        doc.addImage(qrCodeDataUrl, 'PNG', qrX, yPosition, qrSize, qrSize);

        yPosition += qrSize + 5;
        doc.setFontSize(10);
        doc.setTextColor(80, 80, 80);
        doc.setFont('helvetica', 'normal');
        doc.text(`Order #${ticketData.orderId}`, pageWidth / 2, yPosition, { align: 'center' });

        yPosition += 3;
    } catch (error) {
        console.error('Error generating QR code:', error);
        yPosition += 10;
    }

    addSeparator();

    // ===== ORDER INFORMATION =====
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('ORDER INFORMATION', margin, yPosition);
    yPosition += 7;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);

    const orderDate = ticketData.orderDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    doc.text(`Order ID: ${ticketData.orderId}`, margin, yPosition);
    yPosition += 5;
    doc.text(`Date: ${orderDate}`, margin, yPosition);
    yPosition += 5;
    doc.text(`Email: ${ticketData.customerEmail}`, margin, yPosition);
    yPosition += 2;

    addSeparator();

    // ===== EVENT DETAILS =====
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('EVENT DETAILS', margin, yPosition);
    yPosition += 7;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 67, 176);
    doc.text(ticketData.showName, margin, yPosition);
    yPosition += 6;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    doc.text(`📍 ${ticketData.venueName}`, margin, yPosition);
    yPosition += 5;
    doc.text(`   ${ticketData.venueAddress}`, margin, yPosition);
    yPosition += 6;

    const eventDateStr = ticketData.eventDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });
    doc.text(`📅 ${eventDateStr} - ${ticketData.eventTime}`, margin, yPosition);
    yPosition += 2;

    addSeparator();

    // ===== SEAT DETAILS =====
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('SEAT DETAILS', margin, yPosition);
    yPosition += 7;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);

    ticketData.seats.forEach((seat, index) => {
        const ticketTypeLabel = seat.ticketType.charAt(0).toUpperCase() + seat.ticketType.slice(1);
        const seatInfo = `${seat.section} - Row ${seat.row} - Seat ${seat.seatNumber} (${ticketTypeLabel})`;
        const priceStr = `$${seat.price.toFixed(2)}`;

        doc.text(seatInfo, margin, yPosition);
        doc.text(priceStr, pageWidth - margin, yPosition, { align: 'right' });
        yPosition += 5;
    });

    yPosition += 2;
    addSeparator();

    // ===== PURCHASE SUMMARY =====
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('PURCHASE SUMMARY', margin, yPosition);
    yPosition += 7;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);

    doc.text('Subtotal:', margin, yPosition);
    doc.text(`$${ticketData.subtotal.toFixed(2)}`, pageWidth - margin, yPosition, { align: 'right' });
    yPosition += 5;

    doc.text('Service Fee:', margin, yPosition);
    doc.text(`$${ticketData.fees.toFixed(2)}`, pageWidth - margin, yPosition, { align: 'right' });
    yPosition += 5;

    // Total line
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Total Paid:', margin, yPosition);
    doc.text(`$${ticketData.total.toFixed(2)}`, pageWidth - margin, yPosition, { align: 'right' });
    yPosition += 6;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text(`Payment: ${ticketData.paymentMethod.type} ****${ticketData.paymentMethod.last4}`, margin, yPosition);
    yPosition += 2;

    addSeparator();

    // ===== REDEMPTION INSTRUCTIONS =====
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('REDEMPTION INSTRUCTIONS', margin, yPosition);
    yPosition += 7;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);

    const instructions = [
        '• Arrive at least 30 minutes before showtime',
        '• Present this ticket (printed or on mobile) at the entrance',
        '• Your QR code will be scanned for entry',
        '• Keep this ticket for the duration of the event'
    ];

    instructions.forEach(instruction => {
        doc.text(instruction, margin, yPosition);
        yPosition += 5;
    });

    yPosition += 3;
    addSeparator();

    // ===== FOOTER =====
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'italic');
    doc.text('For support, contact: tickets@gardenbros.com', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 4;
    doc.text('Thank you for choosing Garden Bros Circus!', pageWidth / 2, yPosition, { align: 'center' });

    // Save the PDF
    doc.save(`GardenBros_Ticket_${ticketData.orderId}.pdf`);
}

/**
 * Generate ticket PDF and return as base64 string for email attachment
 */
export async function generateTicketPDFAsBase64(ticketData: TicketData): Promise<string> {
    const doc = await createTicketPDF(ticketData);
    return doc.output('datauristring').split(',')[1]; // Return base64 part only
}

/**
 * Internal function to create the PDF document
 * Used by both download and email attachment functions
 */
async function createTicketPDF(ticketData: TicketData): Promise<jsPDF> {
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    let yPosition = margin;

    // Helper function to add section separator
    const addSeparator = () => {
        yPosition += 5;
        doc.setDrawColor(200, 200, 200);
        doc.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 8;
    };

    // ===== HEADER SECTION =====
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 67, 176); // Garden Bros blue
    doc.text('GARDEN BROS CIRCUS', pageWidth / 2, yPosition, { align: 'center' });

    yPosition += 8;
    doc.setFontSize(14);
    doc.setTextColor(100, 100, 100);
    doc.text('TICKET CONFIRMATION', pageWidth / 2, yPosition, { align: 'center' });

    yPosition += 3;
    addSeparator();

    // ===== QR CODE SECTION =====
    try {
        const qrCodeDataUrl = await QRCode.toDataURL(ticketData.qrCodeData, {
            width: 400,
            margin: 1,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            }
        });

        const qrSize = 60;
        const qrX = (pageWidth - qrSize) / 2;
        doc.addImage(qrCodeDataUrl, 'PNG', qrX, yPosition, qrSize, qrSize);

        yPosition += qrSize + 5;
        doc.setFontSize(10);
        doc.setTextColor(80, 80, 80);
        doc.setFont('helvetica', 'normal');
        doc.text(`Order #${ticketData.orderId}`, pageWidth / 2, yPosition, { align: 'center' });

        yPosition += 3;
    } catch (error) {
        console.error('Error generating QR code:', error);
        yPosition += 10;
    }

    addSeparator();

    // ===== ORDER INFORMATION =====
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('ORDER INFORMATION', margin, yPosition);
    yPosition += 7;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);

    const orderDate = ticketData.orderDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    doc.text(`Order ID: ${ticketData.orderId}`, margin, yPosition);
    yPosition += 5;
    doc.text(`Date: ${orderDate}`, margin, yPosition);
    yPosition += 5;
    doc.text(`Email: ${ticketData.customerEmail}`, margin, yPosition);
    yPosition += 2;

    addSeparator();

    // ===== EVENT DETAILS =====
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('EVENT DETAILS', margin, yPosition);
    yPosition += 7;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 67, 176);
    doc.text(ticketData.showName, margin, yPosition);
    yPosition += 6;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    doc.text(`📍 ${ticketData.venueName}`, margin, yPosition);
    yPosition += 5;
    doc.text(`   ${ticketData.venueAddress}`, margin, yPosition);
    yPosition += 6;

    const eventDateStr = ticketData.eventDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });
    doc.text(`📅 ${eventDateStr} - ${ticketData.eventTime}`, margin, yPosition);
    yPosition += 2;

    addSeparator();

    // ===== SEAT DETAILS =====
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('SEAT DETAILS', margin, yPosition);
    yPosition += 7;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);

    ticketData.seats.forEach((seat, index) => {
        const ticketTypeLabel = seat.ticketType.charAt(0).toUpperCase() + seat.ticketType.slice(1);
        const seatInfo = `${seat.section} - Row ${seat.row} - Seat ${seat.seatNumber} (${ticketTypeLabel})`;
        const priceStr = `$${seat.price.toFixed(2)}`;

        doc.text(seatInfo, margin, yPosition);
        doc.text(priceStr, pageWidth - margin, yPosition, { align: 'right' });
        yPosition += 5;
    });

    yPosition += 2;
    addSeparator();

    // ===== PURCHASE SUMMARY =====
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('PURCHASE SUMMARY', margin, yPosition);
    yPosition += 7;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);

    doc.text('Subtotal:', margin, yPosition);
    doc.text(`$${ticketData.subtotal.toFixed(2)}`, pageWidth - margin, yPosition, { align: 'right' });
    yPosition += 5;

    doc.text('Service Fee:', margin, yPosition);
    doc.text(`$${ticketData.fees.toFixed(2)}`, pageWidth - margin, yPosition, { align: 'right' });
    yPosition += 5;

    // Total line
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Total Paid:', margin, yPosition);
    doc.text(`$${ticketData.total.toFixed(2)}`, pageWidth - margin, yPosition, { align: 'right' });
    yPosition += 6;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text(`Payment: ${ticketData.paymentMethod.type} ****${ticketData.paymentMethod.last4}`, margin, yPosition);
    yPosition += 2;

    addSeparator();

    // ===== REDEMPTION INSTRUCTIONS =====
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('REDEMPTION INSTRUCTIONS', margin, yPosition);
    yPosition += 7;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);

    const instructions = [
        '• Arrive at least 30 minutes before showtime',
        '• Present this ticket (printed or on mobile) at the entrance',
        '• Your QR code will be scanned for entry',
        '• Keep this ticket for the duration of the event'
    ];

    instructions.forEach(instruction => {
        doc.text(instruction, margin, yPosition);
        yPosition += 5;
    });

    yPosition += 3;
    addSeparator();

    // ===== FOOTER =====
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'italic');
    doc.text('For support, contact: tickets@gardenbros.com', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 4;
    doc.text('Thank you for choosing Garden Bros Circus!', pageWidth / 2, yPosition, { align: 'center' });

    return doc;
}
