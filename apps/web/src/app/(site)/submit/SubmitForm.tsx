'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import type { Category, Region } from '@/types'

const formSchema = z.object({
    title: z.string().min(3, 'Name must be at least 3 characters'),
    categoryId: z.string().min(1, 'Please select a category'),
    regionId: z.string().min(1, 'Please select a region'),
    address: z.string().min(5, 'Please enter a valid address'),
    description: z.string().min(20, 'Description must be at least 20 characters'),
    phone: z.string().optional(),
    email: z.union([z.string().email('Invalid email address'), z.literal('')]).optional(),
})

type FormValues = z.infer<typeof formSchema>

interface SubmitFormProps {
    categories: Category[]
    regions: Region[]
}

export default function SubmitForm({ categories, regions }: SubmitFormProps) {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [serverError, setServerError] = useState('')

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
    })

    const onSubmit = async (data: FormValues) => {
        setStatus('loading')
        setServerError('')
        try {
            const res = await fetch('/api/submit-resource', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })
            if (!res.ok) throw new Error('Server error')
            setStatus('success')
            reset()
        } catch {
            setStatus('error')
            setServerError('Something went wrong. Please try again.')
        }
    }

    if (status === 'success') {
        return (
            <div className="text-center py-16 px-8">
                <div className="w-20 h-20 rounded-full bg-teal-100 flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 className="font-display text-2xl font-bold text-teal-900 mb-3">
                    Thank you for your submission!
                </h2>
                <p className="text-gray-600 max-w-md mx-auto leading-relaxed mb-8">
                    Your resource is now under review. Once approved by our team, it will appear on the public map.
                </p>
                <button
                    onClick={() => setStatus('idle')}
                    className="inline-flex items-center gap-2 bg-teal-700 hover:bg-teal-800 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
                >
                    Submit another resource
                </button>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Resource Name */}
            <div>
                <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Resource Name <span className="text-red-500">*</span>
                </label>
                <input
                    id="title"
                    type="text"
                    placeholder="e.g. Navrangpura Free Clinic"
                    {...register('title')}
                    className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors
                        ${errors.title ? 'border-red-400 bg-red-50' : 'border-warm-200 bg-white'}`}
                />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
            </div>

            {/* Category + Region row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="categoryId" className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Category <span className="text-red-500">*</span>
                    </label>
                    <select
                        id="categoryId"
                        {...register('categoryId')}
                        className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors appearance-none
                            ${errors.categoryId ? 'border-red-400 bg-red-50' : 'border-warm-200 bg-white'}`}
                    >
                        <option value="">Select a category…</option>
                        {categories.map((c) => (
                            <option key={c._id} value={c._id}>{c.title}</option>
                        ))}
                    </select>
                    {errors.categoryId && <p className="text-red-500 text-xs mt-1">{errors.categoryId.message}</p>}
                </div>
                <div>
                    <label htmlFor="regionId" className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Area / Region <span className="text-red-500">*</span>
                    </label>
                    <select
                        id="regionId"
                        {...register('regionId')}
                        className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors appearance-none
                            ${errors.regionId ? 'border-red-400 bg-red-50' : 'border-warm-200 bg-white'}`}
                    >
                        <option value="">Select an area…</option>
                        {regions.map((r) => (
                            <option key={r._id} value={r._id}>{r.title}{r.pincode ? ` (${r.pincode})` : ''}</option>
                        ))}
                    </select>
                    {errors.regionId && <p className="text-red-500 text-xs mt-1">{errors.regionId.message}</p>}
                </div>
            </div>

            {/* Address */}
            <div>
                <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Street Address <span className="text-red-500">*</span>
                </label>
                <input
                    id="address"
                    type="text"
                    placeholder="e.g. Opposite Town Hall, Ellisbridge"
                    {...register('address')}
                    className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors
                        ${errors.address ? 'border-red-400 bg-red-50' : 'border-warm-200 bg-white'}`}
                />
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
            </div>

            {/* Description */}
            <div>
                <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Description <span className="text-red-500">*</span>
                </label>
                <textarea
                    id="description"
                    rows={4}
                    placeholder="Describe the services, timings, eligibility, and what makes this resource valuable to the community…"
                    {...register('description')}
                    className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors resize-none
                        ${errors.description ? 'border-red-400 bg-red-50' : 'border-warm-200 bg-white'}`}
                />
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
            </div>

            {/* Contact (optional) */}
            <div className="bg-warm-100 rounded-2xl p-5 space-y-4">
                <p className="text-sm font-semibold text-gray-600">Contact Information <span className="font-normal text-gray-400">(optional)</span></p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="phone" className="block text-xs font-medium text-gray-600 mb-1">Phone Number</label>
                        <input
                            id="phone"
                            type="tel"
                            placeholder="+91 98765 43210"
                            {...register('phone')}
                            className="w-full px-4 py-2.5 rounded-xl border border-warm-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-xs font-medium text-gray-600 mb-1">Email Address</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="contact@example.org"
                            {...register('email')}
                            className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-teal-500
                                ${errors.email ? 'border-red-400 bg-red-50' : 'border-warm-200 bg-white'}`}
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>
                </div>
            </div>

            {/* Server error */}
            {status === 'error' && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
                    {serverError}
                </div>
            )}

            {/* Submit */}
            <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full flex items-center justify-center gap-2 bg-teal-700 hover:bg-teal-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-colors text-sm"
            >
                {status === 'loading' ? (
                    <>
                        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                        </svg>
                        Submitting…
                    </>
                ) : (
                    'Submit Resource for Review'
                )}
            </button>

            <p className="text-xs text-center text-gray-400">
                Submissions are reviewed by our team before appearing on the map.
            </p>
        </form>
    )
}
