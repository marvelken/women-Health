'use client'

import { useEffect, useState } from 'react'
import { createClient } from '../../../utils/supabase/client'
import { checkHealthPermissions } from '../../lib/permit'

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function checkAccess() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setError('You need to be logged in to view this page')
        return
      }

      const permissions = await checkHealthPermissions(user.id)
      if (!permissions.canViewLimited) {
        setError('You do not have permission to be here')
      }
    }

    checkAccess()
  }, [])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="p-4 bg-red-50 text-red-600 rounded-lg max-w-md text-center">
          {error}
        </div>
      </div>
    )
  }

  return <>{children}</>
}