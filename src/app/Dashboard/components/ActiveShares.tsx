"use client"

import { useEffect, useState } from "react"
import { Users, Settings, X } from "lucide-react"
import { createClient } from "../../../../utils/supabase/client"

interface Share {
  id: string
  shared_with_email: string
  created_at: string
  active: boolean
}

export default function ActiveShares() {
  const [shares, setShares] = useState<Share[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchShares()
  }, [])

  const fetchShares = async () => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        throw new Error('Not authenticated')
      }

      const { data, error } = await supabase
        .from('record_shares')
        .select('*')
        .eq('owner_id', user.id)
        .eq('active', true)
        .order('created_at', { ascending: false })

      if (error) throw error

      setShares(data || [])
    } catch (err: any) {
      console.error('Error fetching shares:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveShare = async (shareId: string) => {
    try {
      const supabase = createClient()
      
      const { error } = await supabase
        .from('record_shares')
        .update({ active: false })
        .eq('id', shareId)

      if (error) throw error

      // Refresh shares list
      fetchShares()
    } catch (err: any) {
      console.error('Error removing share:', err)
      setError(err.message)
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-16 bg-gray-200 rounded-md"></div>
        <div className="h-16 bg-gray-200 rounded-md"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-red-600">
        Error loading shares: {error}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {shares.map((share) => (
        <div key={share.id} className="flex items-center justify-between p-3 border rounded-md">
          <div className="flex items-center">
            <Users className="text-indigo-500 mr-3" size={20} />
            <div>
              <p className="font-medium">{share.shared_with_email}</p>
              <p className="text-sm text-gray-500">
                Shared {new Date(share.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          <button
            onClick={() => handleRemoveShare(share.id)}
            className="text-gray-400 hover:text-red-600"
            title="Remove share"
          >
            <X size={18} />
          </button>
        </div>
      ))}
    </div>
  )
}