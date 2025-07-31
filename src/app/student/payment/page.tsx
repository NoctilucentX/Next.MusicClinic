// app/admin/payments/page.tsx
'use client'

import React, { useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'

export default function PaymentDashboard() {
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    reference: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert(`Submitted:\nName: ${formData.name}\nAmount: ₱${formData.amount}\nReference: ${formData.reference}`)
    setFormData({ name: '', amount: '', reference: '' })
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-[#f5f5f5] text-black p-6">
        <h1 className="text-3xl font-bold tracking-wide text-gray-900 mb-6">
          Payment Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: QR Code with glassmorphism */}
          <div className="flex flex-col items-center justify-center border size-20px rounded-xl p-6 bg-white/40 backdrop-blur-md shadow-md">
            <img
              src="/qr.png"
                alt="Payment QR Code"
              className="w-64 h-64 object-contain position-fixed mb-3"
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
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm mb-1 text-gray-700">Name</label>
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-black hover:border-gray-500 transition"
                  placeholder="e.g. Iverson Dela Cruz"
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1 text-gray-700">Amount (₱)</label>
                <input
                  name="amount"
                  type="number"
                  value={formData.amount}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-black hover:border-gray-500 transition"
                  placeholder="e.g. 1500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1 text-gray-700">Reference Number</label>
                <input
                  name="reference"
                  type="text"
                  value={formData.reference}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-black hover:border-gray-500 transition"
                  placeholder="e.g. REF123456"
                  required
                />
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
      </div>
    </DashboardLayout>
  )
}
