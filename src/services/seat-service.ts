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

        try {
            // Try Firestore first
            const ordersRef = collection(db, 'orders');
            // We use a short timeout for the real attempt so we don't hang
            const docRef = await Promise.race([
                addDoc(ordersRef, {
                    ...data,
                    status: 'paid',
                    createdAt: serverTimestamp(),
                    fulfillmentStatus: 'unfulfilled',
                }),
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

            return { success: true, orderId: (docRef as any).id };
        } catch (error: any) {
            console.warn('Firestore failed or timed out, falling back to Local Mock Mode.', error);

            // Fallback to LocalStorage (Mock Mode)
            if (typeof window !== 'undefined') {
                const mockId = `mock_order_${Date.now()}`;
                const mockOrder = {
                    ...data,
                    orderId: mockId,
                    status: 'paid',
                    createdAt: new Date().toISOString(),
                    fulfillmentStatus: 'unfulfilled'
                };

                const existingOrders = JSON.parse(localStorage.getItem('mock_orders') || '[]');
                existingOrders.push(mockOrder);
                localStorage.setItem('mock_orders', JSON.stringify(existingOrders));

                // Cleanup holds
                const holds = JSON.parse(localStorage.getItem('mock_holds') || '{}');
                const showId = data.showId || 'unknown';

                seatIds.forEach(id => {
                    const key = `${showId}_${id}`;
                    delete holds[key];
                });
                localStorage.setItem('mock_holds', JSON.stringify(holds));

                return { success: true, orderId: mockId, isMock: true };
            }

            return { success: false, error };
        }
    }
};
