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
}

export const SeatService = {
    // Create a new order in Firestore
    async createOrder(data: CreateOrderData) {
        try {
            const ordersRef = collection(db, 'orders');

            const docRef = await addDoc(ordersRef, {
                ...data,
                status: 'paid', // In a real app, this would be 'pending' until webhook confirms
                createdAt: serverTimestamp(),
                fulfillmentStatus: 'unfulfilled', // Wristbands not yet issued
            });

            console.log('Order created with ID: ', docRef.id);
            return { success: true, orderId: docRef.id };
        } catch (error) {
            console.error('Error adding document: ', error);
            return { success: false, error };
        }
    }
};
