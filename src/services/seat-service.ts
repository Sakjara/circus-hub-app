import { db } from '@/lib/firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export interface OrderItem {
    seatId: string;
    section: string;
    price: number;
    label: string;
    wristband: {
        type: 'Adult' | 'Kid';
        spendLimit: string;
    };
}

export interface CreateOrderData {
    items: OrderItem[];
    total: number;
    paymentToken: string; // Stripe Token
    customerName: string;
    customerEmail: string;
    showId?: string; // Added showId
}

export const SeatService = {
    // Reserve seats temporarily (e.g. for 5 minutes during checkout)
    async holdSeats(seatIds: string[], showId: string): Promise<boolean> {
        try {
            if (typeof window !== 'undefined') {
                const holds = JSON.parse(localStorage.getItem('mock_holds') || '{}');
                const now = Date.now();
                const timeout = 5 * 60 * 1000; // 5 minutes

                // Store new holds with show-specific keys
                seatIds.forEach(id => {
                    const key = `${showId}_${id}`;
                    holds[key] = now + timeout;
                });

                localStorage.setItem('mock_holds', JSON.stringify(holds));
                return true;
            }
        } catch (e) {
            console.warn('Error holding seats:', e);
        }
        return false;
    },

    // Release temporary holds
    async releaseHold(seatIds: string[], showId: string): Promise<void> {
        try {
            if (typeof window !== 'undefined') {
                const holds = JSON.parse(localStorage.getItem('mock_holds') || '{}');
                seatIds.forEach(id => {
                    const key = `${showId}_${id}`;
                    delete holds[key];
                });
                localStorage.setItem('mock_holds', JSON.stringify(holds));
            }
        } catch (e) {
            console.warn('Error releasing holds:', e);
        }
    },

    // Fetch reserved seat IDs for a specific show
    async getReservedSeats(showId: string): Promise<string[]> {
        try {
            if (typeof window !== 'undefined') {
                // 1. Confirmed Orders
                const mockOrders = JSON.parse(localStorage.getItem('mock_orders') || '[]');
                const reserved: string[] = [];
                mockOrders.forEach((order: any) => {
                    // Filter by showId
                    if (order.showId === showId && order.items) {
                        order.items.forEach((item: any) => reserved.push(item.seatId));
                    }
                });

                // 2. Temporary Holds
                const holds = JSON.parse(localStorage.getItem('mock_holds') || '{}');
                const now = Date.now();
                Object.keys(holds).forEach(key => {
                    // Check if this hold belongs to this show
                    if (key.startsWith(`${showId}_`)) {
                        const seatId = key.split('_')[1]; // Extract seatId
                        if (holds[key] > now) {
                            if (!reserved.includes(seatId)) {
                                reserved.push(seatId);
                            }
                        } else {
                            delete holds[key]; // Lazy cleanup
                        }
                    } else if (holds[key] <= now) {
                        delete holds[key]; // Global cleanup of expired holds not belonging to this show
                    }
                });

                localStorage.setItem('mock_holds', JSON.stringify(holds));
                return reserved;
            }
        } catch (e) {
            console.warn('Error fetching reserved seats:', e);
        }
        return [];
    },

    // Create a new order in Firestore (with LocalStorage Fallback)
    async createOrder(data: CreateOrderData) {
        const seatIds = data.items.map(i => i.seatId);
        const showId = data.showId || 'unknown';

        // Generate order ID
        const orderId = `GBC-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;

        // Parse seat information from items
        const seats = data.items.map(item => {
            const parts = item.label.split('-');
            return {
                sectionId: item.section,
                sectionName: item.section,
                row: parts[1] || 'A',
                seatNumber: parseInt(parts[2]) || 1,
                ticketType: (item.wristband?.type?.toLowerCase() || 'adult') as 'adult' | 'child' | 'promo',
                price: item.price
            };
        });

        // Calculate fees (5% service fee)
        const subtotal = data.total;
        const fees = subtotal * 0.05;
        const total = subtotal + fees;

        // Create complete order object
        const orderData = {
            orderId,
            status: 'PAID' as const, // Order is paid immediately in this flow
            createdAt: new Date(),
            updatedAt: new Date(),

            // Customer Info
            customerEmail: data.customerEmail,
            customerName: data.customerName,

            // Event Info
            showId,
            showName: 'Garden Bros Nuclear Circus', // TODO: Get from show data
            performanceId: 'perf-1', // TODO: Get from selected performance
            performanceDate: new Date('2025-02-12'), // TODO: Get from selected performance
            venue: {
                name: 'North Point Mall',
                address: '1000 North Point Circle, Alpharetta, GA'
            },

            // Seats
            seats,

            // Payment
            subtotal,
            fees,
            total,
            paymentMethod: {
                type: 'Visa',
                last4: data.paymentToken.slice(-4)
            },
            stripeCustomerId: data.paymentToken,

            // QR Code
            qrCodeData: orderId,
            qrCodeUrl: '' // Will be generated separately
        };

        try {
            // Try Firestore first
            const ordersRef = collection(db, 'orders');

            // Convert dates to Firestore timestamps for storage
            const firestoreData = {
                ...orderData,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                performanceDate: new Date(orderData.performanceDate).toISOString()
            };

            const docRef = await Promise.race([
                addDoc(ordersRef, firestoreData),
                new Promise<never>((_, reject) =>
                    setTimeout(() => reject(new Error('Firebase timeout')), 3000)
                )
            ]);

            console.log('Order created in Firestore with ID: ', (docRef as any).id);

            // Cleanup holds
            if (typeof window !== 'undefined') {
                const holds = JSON.parse(localStorage.getItem('mock_holds') || '{}');
                seatIds.forEach(id => {
                    const key = `${showId}_${id}`;
                    delete holds[key];
                });
                localStorage.setItem('mock_holds', JSON.stringify(holds));
            }

            return { success: true, orderId };
        } catch (error: any) {
            console.warn('Firestore failed or timed out, falling back to Local Mock Mode.', error);

            // Fallback to LocalStorage (Mock Mode)
            if (typeof window !== 'undefined') {
                const mockOrder = {
                    ...orderData,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    performanceDate: orderData.performanceDate.toISOString()
                };

                const existingOrders = JSON.parse(localStorage.getItem('mock_orders') || '[]');
                existingOrders.push(mockOrder);
                localStorage.setItem('mock_orders', JSON.stringify(existingOrders));

                // Cleanup holds
                const holds = JSON.parse(localStorage.getItem('mock_holds') || '{}');
                seatIds.forEach(id => {
                    const key = `${showId}_${id}`;
                    delete holds[key];
                });
                localStorage.setItem('mock_holds', JSON.stringify(holds));

                return { success: true, orderId, isMock: true };
            }

            return { success: false, error };
        }
    },

    // Get order by ID
    async getOrder(orderId: string) {
        try {
            // Try localStorage first (for mock orders)
            if (typeof window !== 'undefined') {
                const mockOrders = JSON.parse(localStorage.getItem('mock_orders') || '[]');
                const order = mockOrders.find((o: any) => o.orderId === orderId);
                if (order) {
                    return { success: true, order };
                }
            }

            // TODO: Query Firestore for real orders
            return { success: false, error: 'Order not found' };
        } catch (error) {
            return { success: false, error };
        }
    },

    // Update order status
    async updateOrderStatus(orderId: string, status: 'PENDING' | 'PAID' | 'FULFILLED' | 'CANCELLED') {
        try {
            // Update in localStorage for mock orders
            if (typeof window !== 'undefined') {
                const mockOrders = JSON.parse(localStorage.getItem('mock_orders') || '[]');
                const orderIndex = mockOrders.findIndex((o: any) => o.orderId === orderId);

                if (orderIndex !== -1) {
                    mockOrders[orderIndex].status = status;
                    mockOrders[orderIndex].updatedAt = new Date().toISOString();
                    localStorage.setItem('mock_orders', JSON.stringify(mockOrders));
                    return { success: true };
                }
            }

            // TODO: Update in Firestore
            return { success: false, error: 'Order not found' };
        } catch (error) {
            return { success: false, error };
        }
    }
};
