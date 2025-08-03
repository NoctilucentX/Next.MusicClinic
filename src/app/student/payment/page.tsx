/* eslint-disable @typescript-eslint/no-explicit-any */
// app/admin/payments/page.tsx
"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import useAuthStore from "@/store/useAuthStore";
import { usePaymentStore } from "@/store/usePaymentStore";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import moment from "moment";

type PaymentForm = {
  amount: number;
  reference: string;
};

export default function PaymentDashboard() {
  const { user }: any = useAuthStore();
  const { createPayment, fetchPayments, payments } = usePaymentStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PaymentForm>();

  const onSubmit = (data: PaymentForm) => {
    if (data) {
      createPayment({
        ...data,
        displayName: user?.displayName,
        uid: user?.uid,
      });
    }
    reset(); // clear form after submission
  };

  useEffect(() => {
    if (user) {
      fetchPayments(user?.uid);
    }
  }, [user, fetchPayments]);

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-[#f5f5f5] text-black p-6">
        <h1 className="text-3xl font-bold tracking-wide text-gray-900 mb-6">
          Payment Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: QR Code */}
          <div className="flex flex-col items-center justify-center border size-20px rounded-xl p-6 bg-white/40 backdrop-blur-md shadow-md">
            <img
              src="/qr.png"
              alt="Payment QR Code"
              className="w-64 h-64 object-contain mb-3"
            />
            <p className="text-sm text-gray-700">
              Scan to pay <strong>Sernan G.</strong> via GCash
            </p>
          </div>

          {/* Right: Payment Input Form */}
          <div className="border rounded-xl p-6 bg-white shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Enter Your Payment Details
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm mb-1 text-gray-700">
                  Amount (₱)
                </label>
                <input
                  type="number"
                  step="any"
                  {...register("amount", { required: true, min: 1 })}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-black hover:border-gray-500 transition"
                  placeholder="e.g. 1500"
                />
                {errors.amount && (
                  <p className="text-sm text-red-500 mt-1">
                    Amount is required
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700">
                  Reference Number
                </label>
                <input
                  {...register("reference", { required: true })}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-black hover:border-gray-500 transition"
                  placeholder="e.g. REF123456"
                />
                {errors.reference && (
                  <p className="text-sm text-red-500 mt-1">
                    Reference number is required
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="mt-4 w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 active:scale-95 transition-transform duration-150 ease-in-out"
              >
                Submit Payment
              </button>
            </form>
          </div>
        </div>

        {payments.length > 0 && (
          <Card className="mt-10 border-1 shadow-md">
            <CardHeader>
              <CardTitle>Payment Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reference</TableHead>
                    <TableHead>Amount (₱)</TableHead>
                    <TableHead>Paid By</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...payments]
                    .sort(
                      (a, b) =>
                        (b.createdAt?.toMillis?.() ?? 0) -
                        (a.createdAt?.toMillis?.() ?? 0)
                    )
                    .map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">
                          {payment.reference}
                        </TableCell>
                        <TableCell>
                          ₱{Number(payment.amount).toFixed(2)}
                        </TableCell>
                        <TableCell>{payment.displayName || "N/A"}</TableCell>
                        <TableCell>
                          {payment.createdAt
                            ? moment(payment.createdAt.toDate()).format(
                                "MMM DD, YYYY"
                              )
                            : "-"}
                        </TableCell>
                        <TableCell>
                          {payment.createdAt
                            ? moment(payment.createdAt.toDate()).format(
                                "hh:mm A"
                              )
                            : "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
