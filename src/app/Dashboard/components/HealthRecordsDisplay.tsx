"use client"

import { useEffect, useState } from "react"
import { createClient } from "../../../../utils/supabase/client"
import { Calendar, Activity } from "lucide-react"

interface HealthRecord {
  id: string
  record_date: string
  period_flow: string
  symptoms: string[]
  mood: string
  notes: string
  created_at: string
}

export default function HealthRecordsDisplay() {
  const [records, setRecords] = useState<HealthRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchRecords() {
      try {
        const supabase = createClient()
        
        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError) throw userError

        // Fetch records
        const { data, error } = await supabase
          .from('health_records')
          .select('*')
          .eq('user_id', user?.id)
          .order('record_date', { ascending: false })

        if (error) throw error

        setRecords(data)
      } catch (err: any) {
        console.error('Error fetching records:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchRecords()
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 rounded-lg"></div>
        </div>
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 text-red-600 bg-red-50 rounded-lg">
        Error loading records: {error}
      </div>
    )
  }

  if (records.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
        <Calendar className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No records</h3>
        <p className="mt-1 text-sm text-gray-500">
          Start tracking your health by clicking the "Log Today" button.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {records.map((record) => (
        <div key={record.id} className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  {new Date(record.record_date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </h3>
                {record.period_flow && (
                  <p className="text-sm text-indigo-600">
                    Flow: {record.period_flow}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-600">
                Mood: {record.mood || 'Not recorded'}
              </span>
            </div>
          </div>

          {record.symptoms && record.symptoms.length > 0 && (
            <div className="mt-2">
              <div className="flex flex-wrap gap-2">
                {record.symptoms.map((symptom, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                  >
                    {symptom}
                  </span>
                ))}
              </div>
            </div>
          )}

          {record.notes && (
            <p className="mt-2 text-sm text-gray-600 whitespace-pre-line">
              {record.notes}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}