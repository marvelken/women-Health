"use client"

import { useState, FormEvent } from "react"
import { Mail, X } from "lucide-react"
import { createClient } from "../../../../utils/supabase/client"
import permit from "../../../lib/permit"

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ShareModal({ isOpen, onClose }: ShareModalProps) {
  const [email, setEmail] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  if (!isOpen) return null

  const handleShare = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    setSuccess(false)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        throw new Error('Not authenticated')
      }

    //   // Check if recipient exists in Permit.io
    //   const users = await permit.api.listUsers({
    //     filter: `email=${email}`
    //   })

    //   if (!users || users.length === 0) {
    //     throw new Error('Recipient needs to create an account first')
    //   }

      // Check if sharing already exists and is active
      const { data: existingShare } = await supabase
        .from('record_shares')
        .select('*')
        .eq('owner_id', user.id)
        .eq('shared_with_email', email)
        .eq('active', true)
        .single()

      if (existingShare) {
        throw new Error('Already shared with this email')
      }

      // Create new share record
      const { error: shareError } = await supabase
        .from('record_shares')
        .insert([{
          owner_id: user.id,
          shared_with_email: email,
          active: true
        }])

      if (shareError) throw shareError

      setSuccess(true)
      setEmail("")
      setTimeout(() => {
        onClose()
      }, 2000)

    } catch (err: any) {
      console.error('Error sharing records:', err)
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-xl font-semibold text-gray-900">
            Share Health Records
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleShare} className="p-6 space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 text-sm text-green-600 bg-green-50 rounded-md">
              Successfully shared records!
            </div>
          )}

          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Enter email of doctor, partner, or parent
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter their email"
                required
              />
            </div>
            <p className="mt-1 text-sm text-gray-500">
              They will only be able to see information based on their role.
            </p>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={submitting}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
            >
              {submitting ? 'Sharing...' : 'Share Records'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}