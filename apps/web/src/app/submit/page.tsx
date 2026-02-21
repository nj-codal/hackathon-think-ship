'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Send, CheckCircle, Loader2 } from 'lucide-react'

const submitSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    categoryId: z.string().min(1, 'Please select a category'),
    regionId: z.string().min(1, 'Please select a region'),
    address: z.string().min(5, 'Please provide a valid address'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    phone: z.string().optional(),
    email: z.string().email('Invalid email').optional().or(z.literal('')),
})

type SubmitFormData = z.infer<typeof submitSchema>

interface CategoryOption { _id: string; title: string }
interface RegionOption { _id: string; title: string }

export default function SubmitResourcePage() {
    const [categories, setCategories] = useState<CategoryOption[]>([])
    const [regions, setRegions] = useState<RegionOption[]>([])
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [serverError, setServerError] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SubmitFormData>({
        resolver: zodResolver(submitSchema),
    })

    useEffect(() => {
        async function fetchOptions() {
            try {
                const res = await fetch('/api/form-options')
                const data = await res.json()
                setCategories(data.categories || [])
                setRegions(data.regions || [])
            } catch (err) {
                console.error('Failed to fetch form options:', err)
            }
        }
        fetchOptions()
    }, [])

    const onSubmit = async (data: SubmitFormData) => {
        setServerError(null)
        try {
            const res = await fetch('/api/submit-resource', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })
            if (!res.ok) {
                const errData = await res.json()
                throw new Error(errData.message || 'Submission failed')
            }
            setIsSubmitted(true)
        } catch (err: any) {
            setServerError(err.message || 'Something went wrong')
        }
    }

    if (isSubmitted) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600">
                    <CheckCircle className="h-10 w-10" />
                </div>
                <h1 className="mt-8 font-display text-4xl font-black text-slate-900">Thank You!</h1>
                <p className="mt-4 max-w-md text-lg text-slate-600">
                    Your submission is under review. Once an admin approves it, your resource will appear on the public map.
                </p>
                <a href="/" className="mt-8 inline-flex items-center rounded-xl border-2 border-slate-900 bg-brand-600 px-8 py-3 font-bold text-white transition-transform hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
                    Back to Home
                </a>
            </div>
        )
    }

    return (
        <div className="container mx-auto max-w-2xl px-4 py-16 sm:px-6">
            <header className="mb-10 border-b-2 border-slate-900 pb-6">
                <h1 className="font-display text-4xl font-black text-slate-900">Submit a Resource</h1>
                <p className="mt-3 text-lg text-slate-600">
                    Know a community service that should be on the map? Add it here and we'll review it.
                </p>
            </header>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {serverError && (
                    <div className="rounded-xl border-2 border-red-400 bg-red-50 p-4 text-sm font-medium text-red-700">
                        {serverError}
                    </div>
                )}

                {/* Title */}
                <div>
                    <label htmlFor="title" className="block text-sm font-bold uppercase tracking-wider text-slate-500">Resource Name *</label>
                    <input
                        id="title"
                        type="text"
                        {...register('title')}
                        className="mt-2 block w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-100"
                        placeholder="e.g., M.J. Library"
                    />
                    {errors.title && <p className="mt-1.5 text-sm text-red-600">{errors.title.message}</p>}
                </div>

                {/* Category & Region */}
                <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                        <label htmlFor="categoryId" className="block text-sm font-bold uppercase tracking-wider text-slate-500">Category *</label>
                        <select
                            id="categoryId"
                            {...register('categoryId')}
                            className="mt-2 block w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-100"
                        >
                            <option value="">Select Category</option>
                            {categories.map((cat) => (
                                <option key={cat._id} value={cat._id}>{cat.title}</option>
                            ))}
                        </select>
                        {errors.categoryId && <p className="mt-1.5 text-sm text-red-600">{errors.categoryId.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="regionId" className="block text-sm font-bold uppercase tracking-wider text-slate-500">Region *</label>
                        <select
                            id="regionId"
                            {...register('regionId')}
                            className="mt-2 block w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-100"
                        >
                            <option value="">Select Region</option>
                            {regions.map((region) => (
                                <option key={region._id} value={region._id}>{region.title}</option>
                            ))}
                        </select>
                        {errors.regionId && <p className="mt-1.5 text-sm text-red-600">{errors.regionId.message}</p>}
                    </div>
                </div>

                {/* Address */}
                <div>
                    <label htmlFor="address" className="block text-sm font-bold uppercase tracking-wider text-slate-500">Street Address *</label>
                    <input
                        id="address"
                        type="text"
                        {...register('address')}
                        className="mt-2 block w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-100"
                        placeholder="e.g., Kavi Nanalal Marg, Near Town Hall"
                    />
                    {errors.address && <p className="mt-1.5 text-sm text-red-600">{errors.address.message}</p>}
                </div>

                {/* Description */}
                <div>
                    <label htmlFor="description" className="block text-sm font-bold uppercase tracking-wider text-slate-500">Description *</label>
                    <textarea
                        id="description"
                        rows={4}
                        {...register('description')}
                        className="mt-2 block w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-100"
                        placeholder="Describe the resource, what services it offers, etc."
                    />
                    {errors.description && <p className="mt-1.5 text-sm text-red-600">{errors.description.message}</p>}
                </div>

                {/* Contact */}
                <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                        <label htmlFor="phone" className="block text-sm font-bold uppercase tracking-wider text-slate-500">Contact Phone</label>
                        <input
                            id="phone"
                            type="tel"
                            {...register('phone')}
                            className="mt-2 block w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-100"
                            placeholder="+91 98765 43210"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-bold uppercase tracking-wider text-slate-500">Contact Email</label>
                        <input
                            id="email"
                            type="email"
                            {...register('email')}
                            className="mt-2 block w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-100"
                            placeholder="contact@example.com"
                        />
                        {errors.email && <p className="mt-1.5 text-sm text-red-600">{errors.email.message}</p>}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex w-full items-center justify-center gap-3 rounded-xl border-2 border-slate-900 bg-brand-600 px-8 py-4 font-display text-lg font-bold text-white transition-all hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] disabled:opacity-50 disabled:pointer-events-none"
                >
                    {isSubmitting ? (
                        <><Loader2 className="h-5 w-5 animate-spin" /> Submitting...</>
                    ) : (
                        <><Send className="h-5 w-5" /> Submit Resource</>
                    )}
                </button>
            </form>
        </div>
    )
}
