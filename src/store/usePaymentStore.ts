/* eslint-disable @typescript-eslint/no-explicit-any */
// stores/usePaymentStore.ts
import { create } from "zustand";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  orderBy,
  query,
  where,
  getDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

type PaymentData = {
  id?: string;
  displayName: string;
  amount: number;
  reference: string;
  uid: string;
  createdAt?: any;
};

type PaymentStore = {
  payment: PaymentData | null;
  payments: PaymentData[];
  setPayment: (data: PaymentData) => void;
  clearPayment: () => void;
  createPayment: (data: PaymentData) => Promise<void>;
  fetchPayments: (id: string) => Promise<void>;
};

export const usePaymentStore = create<PaymentStore>((set) => ({
  payment: null,
  payments: [],
  setPayment: (data) => set({ payment: data }),
  clearPayment: () => set({ payment: null }),
  createPayment: async (data) => {
    try {
      const docRef = await addDoc(collection(db, "payments"), {
        ...data,
        createdAt: serverTimestamp(),
      });

      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const newPayment = {
          id: docSnap.id,
          ...docSnap.data(),
        } as PaymentData;

        set((state) => ({
          payments: [newPayment, ...state.payments],
        }));
      }
    } catch (error) {
      console.error("Error adding payment to Firestore:", error);
      throw error;
    }
  },
  fetchPayments: async (id: string) => {
    const q = query(collection(db, "payments"), where("uid", "==", id));
    const snapshot = await getDocs(q);
    const payments = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as PaymentData[];

    // Sort by createdAt descending (newest first)
    payments.sort((a, b) => {
      const aTime = new Date(a.createdAt).getTime();
      const bTime = new Date(b.createdAt).getTime();
      return bTime - aTime;
    });

    set({ payments });
  },
}));
