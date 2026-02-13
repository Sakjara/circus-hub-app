import { Resend } from 'resend';

// Initialize Resend with API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY || '');

export interface SendOrderConfirmationParams {
    to: string;
    customerName: string;
    orderId: string;
    orderDate: string;
    showName: string;
    venueName: string;
    venueAddress: string;
    eventDate: string;
    eventTime: string;
    seats: Array<{
        section: string;
        row: string;
        seatNumber: number;
        ticketType: string;
        price: number;
    }>;
    subtotal: number;
    fees: number;
    total: number;
    paymentMethod: string;
    qrCodeDataUrl: string; // Required - this IS the ticket
    logoUrl?: string; // Optional - Garden Bros logo for email header
}

export const EmailService = {
    /**
     * Send order confirmation email with QR code (digital ticket)
     */
    async sendOrderConfirmation(params: SendOrderConfirmationParams) {
        try {
            // Generate email HTML
            const html = generateOrderConfirmationHTML(params);

            // Prepare email data
            const emailData: any = {
                from: 'Garden Bros Circus <tickets@gardenbros.com>',
                to: params.to,
                subject: `✅ Order Confirmed - ${params.orderId} - Garden Bros Circus`,
                html,
            };

            // No PDF attachment - QR code in email is the ticket

            // Send email via Resend
            const response = await resend.emails.send(emailData);

            console.log('Email sent successfully:', response);
            return { success: true, messageId: response.data?.id };
        } catch (error) {
            console.error('Error sending email:', error);
            return { success: false, error };
        }
    },

    /**
     * Test email configuration
     */
    async testConnection() {
        try {
            const response = await resend.emails.send({
                from: 'Garden Bros Circus <tickets@gardenbros.com>',
                to: 'test@example.com',
                subject: 'Test Email',
                html: '<p>This is a test email from Garden Bros Circus.</p>',
            });
            return { success: true, response };
        } catch (error) {
            return { success: false, error };
        }
    },
};

/**
 * Generate HTML email template for order confirmation
 */
function generateOrderConfirmationHTML(params: SendOrderConfirmationParams): string {
    const seatsList = params.seats
        .map(
            (seat) =>
                `<li style="margin-bottom: 8px;">
                    <strong>Section ${seat.section}</strong> - Row ${seat.row} - Seat ${seat.seatNumber} 
                    <span style="color: #666;">(${seat.ticketType})</span> - 
                    <strong>$${seat.price.toFixed(2)}</strong>
                </li>`
        )
        .join('');

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px 0;">
        <tr>
            <td align="center">
                <!-- Main Container -->
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden;">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #0043B0 0%, #00A3E0 100%); padding: 40px 30px; text-align: center;">
                            ${params.logoUrl
            ? `<img src="${params.logoUrl}" alt="Garden Bros Circus" style="max-width: 300px; height: auto;" />`
            : `<h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold;">
                                    GARDEN BROS CIRCUS
                                   </h1>`
        }
                            <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 16px; opacity: 0.9;">
                                Order Confirmation
                            </p>
                        </td>
                    </tr>

                    <!-- Success Message -->
                    <tr>
                        <td style="padding: 30px; text-align: center; background-color: #f0f9ff; border-bottom: 3px solid #0043B0;">
                            <div style="display: inline-block; background-color: #10b981; color: white; padding: 12px 24px; border-radius: 50px; font-size: 18px; font-weight: bold;">
                                ✅ Order Confirmed!
                            </div>
                            <p style="margin: 15px 0 0 0; color: #374151; font-size: 16px;">
                                Thank you, <strong>${params.customerName}</strong>! Your tickets are ready.
                            </p>
                        </td>
                    </tr>

                    <!-- QR Code - THIS IS YOUR TICKET -->
                    ${params.qrCodeDataUrl
            ? `
                    <tr>
                        <td style="padding: 40px 30px; text-align: center; background-color: #fafafa; border-top: 3px solid #0043B0; border-bottom: 3px solid #0043B0;">
                            <p style="margin: 0 0 10px 0; color: #0043B0; font-size: 18px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">
                                🎟️ This is Your Ticket
                            </p>
                            <p style="margin: 0 0 20px 0; color: #666; font-size: 14px;">
                                Show this QR code at the entrance
                            </p>
                            <img src="${params.qrCodeDataUrl}" alt="QR Code" style="width: 250px; height: 250px; border: 3px solid #0043B0; border-radius: 12px; background: white; padding: 10px;" />
                            <p style="margin: 20px 0 0 0; color: #374151; font-size: 20px; font-weight: bold; font-family: monospace;">
                                ${params.orderId}
                            </p>
                            <p style="margin: 10px 0 0 0; color: #666; font-size: 13px; font-style: italic;">
                                Save this email or take a screenshot
                            </p>
                        </td>
                    </tr>
                    `
            : ''
        }

                    <!-- Purchase Description -->
                    <tr>
                        <td style="padding: 30px;">
                            <h2 style="margin: 0 0 20px 0; color: #d32f2f; font-size: 18px; font-weight: bold; text-transform: uppercase;">
                                DESCRIPCIÓN DE LA COMPRA
                            </h2>
                            
                            <!-- Venue -->
                            <div style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #e5e7eb;">
                                <p style="margin: 0 0 5px 0; color: #999; font-size: 12px; text-transform: uppercase;">
                                    📍 VENUE
                                </p>
                                <p style="margin: 0; color: #111; font-size: 15px; font-weight: bold;">
                                    ${params.venueName}
                                </p>
                                <p style="margin: 5px 0 0 0; color: #666; font-size: 13px;">
                                    ${params.venueAddress}
                                </p>
                            </div>

                            <!-- Show -->
                            <div style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #e5e7eb;">
                                <p style="margin: 0 0 5px 0; color: #999; font-size: 12px; text-transform: uppercase;">
                                    🎪 SHOW
                                </p>
                                <p style="margin: 0; color: #111; font-size: 15px; font-weight: bold;">
                                    ${params.showName}
                                </p>
                            </div>

                            <!-- Date & Time -->
                            <div style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #e5e7eb;">
                                <p style="margin: 0 0 5px 0; color: #999; font-size: 12px; text-transform: uppercase;">
                                    📅 FECHA
                                </p>
                                <p style="margin: 0; color: #111; font-size: 15px; font-weight: bold;">
                                    ${params.eventDate} ${params.eventTime}
                                </p>
                            </div>

                            <!-- Seats -->
                            <div style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #e5e7eb;">
                                <p style="margin: 0 0 5px 0; color: #999; font-size: 12px; text-transform: uppercase;">
                                    🎟️ ASIENTOS
                                </p>
                                ${params.seats.map(seat => `
                                    <p style="margin: 3px 0; color: #111; font-size: 14px;">
                                        <strong>Sección ${seat.section}</strong> - Fila ${seat.row} - Asiento ${seat.seatNumber}
                                    </p>
                                `).join('')}
                            </div>

                            <!-- Tickets -->
                            <div style="margin-bottom: 0;">
                                <p style="margin: 0 0 5px 0; color: #999; font-size: 12px; text-transform: uppercase;">
                                    🎫 ENTRADAS
                                </p>
                                ${params.seats.map(seat => `
                                    <p style="margin: 3px 0; color: #111; font-size: 14px;">
                                        ${seat.ticketType === 'adult' ? 'Adulto' : seat.ticketType === 'child' ? 'Niño' : 'Promoción'}: <strong>$${seat.price.toFixed(2)}</strong>
                                    </p>
                                `).join('')}
                            </div>
                        </td>
                    </tr>

                    <!-- Purchase Summary / Detalle de la Compra -->
                    <tr>
                        <td style="padding: 30px; background-color: #f9fafb;">
                            <h2 style="margin: 0 0 20px 0; color: #d32f2f; font-size: 18px; font-weight: bold; text-transform: uppercase;">
                                DETALLE DE LA COMPRA
                            </h2>
                            ${params.seats.map(seat => `
                                <p style="margin: 5px 0; color: #111; font-size: 14px;">
                                    ${params.seats.length} x ${seat.ticketType === 'adult' ? 'ENTRADA ADULTO' : seat.ticketType === 'child' ? 'ENTRADA NIÑO' : 'ENTRADA PROMOCIÓN'}: <strong>$${seat.price.toFixed(2)}</strong>
                                </p>
                            `).join('')}
                            <p style="margin: 10px 0 5px 0; color: #111; font-size: 14px;">
                                ${params.seats.length} x CARGO POR SERVICIO POR ENTRADA: <strong>$${(params.fees / params.seats.length).toFixed(2)}</strong>
                            </p>
                        </td>
                    </tr>

                    <!-- Payment Details / Detalle del Pago -->
                    <tr>
                        <td style="padding: 30px;">
                            <h2 style="margin: 0 0 20px 0; color: #d32f2f; font-size: 18px; font-weight: bold; text-transform: uppercase;">
                                DETALLE DEL PAGO
                            </h2>
                            <table width="100%" cellpadding="6" cellspacing="0" style="font-size: 14px;">
                                <tr>
                                    <td style="color: #666; padding: 5px 0;">Número de orden / compra:</td>
                                    <td style="color: #111; font-weight: bold; text-align: right; font-family: monospace;">${params.orderId}</td>
                                </tr>
                                <tr>
                                    <td style="color: #666; padding: 5px 0;">Fecha Compra:</td>
                                    <td style="color: #111; text-align: right;">${params.orderDate}</td>
                                </tr>
                                <tr style="border-top: 2px solid #e5e7eb;">
                                    <td style="color: #111; font-weight: bold; padding: 12px 0 5px 0;">Total Compra:</td>
                                    <td style="color: #d32f2f; font-size: 18px; font-weight: bold; text-align: right; padding: 12px 0 5px 0;">$${params.total.toFixed(2)}</td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Instructions -->
                    <tr>
                        <td style="padding: 30px; background-color: #fffbeb; border-top: 3px solid #fbbf24;">
                            <h3 style="margin: 0 0 15px 0; color: #92400e; font-size: 16px;">
                                📌 Important Information
                            </h3>
                            <ul style="margin: 0; padding: 0 0 0 20px; color: #78350f; font-size: 14px; line-height: 1.6;">
                                <li>Arrive at least <strong>30 minutes before showtime</strong></li>
                                <li>Show this email with the QR code at the entrance</li>
                                <li>Your QR code will be scanned for entry</li>
                                <li>Keep this ticket for the duration of the event</li>
                            </ul>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding: 30px; text-align: center; background-color: #f9fafb; border-top: 1px solid #e5e7eb;">
                            <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">
                                Need help? Contact us at <a href="mailto:tickets@gardenbros.com" style="color: #0043B0; text-decoration: none;">tickets@gardenbros.com</a>
                            </p>
                            <p style="margin: 0; color: #999; font-size: 12px;">
                                Thank you for choosing Garden Bros Circus! 🎪
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `.trim();
}
