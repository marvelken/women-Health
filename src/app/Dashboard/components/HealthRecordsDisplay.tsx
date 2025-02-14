// src/app/Dashboard/components/HealthRecordsDisplay.tsx
'use client'

import { useState, useEffect } from 'react'
import { getHealthRecords } from '../actions'

export default function HealthRecordsDisplay() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecords = async () => {
      const data = await getHealthRecords()
      setRecords(data)
      setLoading(false)
    }

    fetchRecords()
  }, [])

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (records.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No health records yet. Start tracking your health today!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {records.map((record: any) => (
        <div key={record.id} className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-medium">{new Date(record.record_date).toLocaleDateString()}</h3>
              {record.period_flow && (
                <span className="text-sm text-indigo-600">Flow: {record.period_flow}</span>
              )}
            </div>
            <span className="text-sm text-gray-500">
              {record.mood && `Mood: ${record.mood}`}
            </span>
          </div>
          
          {record.symptoms && record.symptoms.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {record.symptoms.map((symptom: string, index: number) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full"
                >
                  {symptom}
                </span>
              ))}
            </div>
          )}
          
          {record.notes && (
            <p className="mt-2 text-sm text-gray-600">{record.notes}</p>
          )}
        </div>
      ))}
    </div>
  )
}