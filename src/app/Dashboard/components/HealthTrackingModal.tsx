"use client"

import { useState, FormEvent } from "react"
import { Calendar, X, Plus } from "lucide-react"
import { createClient } from "../../../../utils/supabase/client"

interface HealthTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function HealthTrackingModal({ isOpen, onClose }: HealthTrackingModalProps) {
  const [symptoms, setSymptoms] = useState<string[]>([])
  const [newSymptom, setNewSymptom] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const symptomOptions = [
    "Cramps", "Headache", "Fatigue", "Bloating", 
    "Mood Swings", "Back Pain", "Breast Tenderness"
  ]

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        throw new Error('Not authenticated')
      }

      const formElement = event.target as HTMLFormElement
      const formData = new FormData(formElement)

      const healthRecord = {
        user_id: user.id,
        record_date: formData.get('date'),
        period_flow: formData.get('flow'),
        symptoms: symptoms,
        mood: formData.get('mood'),
        notes: formData.get('notes'),
        created_at: new Date().toISOString()
      }

      const { error: uploadError } = await supabase
        .from('health_records')
        .insert([healthRecord])

      if (uploadError) throw uploadError

      formElement.reset()
      setSymptoms([])
      setNewSymptom("")
      onClose()

    } catch (err: any) {
      setError(err.message || 'Failed to save record')
      console.error('Error saving record:', err)
    } finally {
      setSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-2xl mx-4" style={{ maxHeight: 'calc(100vh - 2rem)' }}>
        {/* Header */}
        <div className="sticky top-0 bg-white border-b z-10">
          <div className="p-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold">Track Your Health</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
              type="button"
            >
              <X size={24} />
            </button>
          </div>
          {error && (
            <div className="px-4 pb-4">
              <div className="p-3 bg-red-50 text-red-700 rounded-md">
                {error}
              </div>
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="overflow-y-auto px-4" style={{ maxHeight: 'calc(100vh - 13rem)' }}>
            <div className="py-4 space-y-6">
              {/* Date Selection */}
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id="date"
                    name="date"
                    required
                    defaultValue={new Date().toISOString().split('T')[0]}
                    className="w-full p-2 border rounded-md pl-10"
                  />
                  <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              {/* Period Flow */}
              <div>
                <label htmlFor="flow" className="block text-sm font-medium text-gray-700 mb-2">
                  Period Flow
                </label>
                <select 
                  id="flow"
                  name="flow"
                  required
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select flow level</option>
                  <option value="light">Light</option>
                  <option value="medium">Medium</option>
                  <option value="heavy">Heavy</option>
                </select>
              </div>

              {/* Symptoms */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Symptoms
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {symptoms.map((symptom, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800"
                    >
                      {symptom}
                      <button
                        type="button"
                        onClick={() => setSymptoms(symptoms.filter((_, i) => i !== index))}
                        className="ml-2 text-indigo-600 hover:text-indigo-800"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <select
                    value={newSymptom}
                    onChange={(e) => setNewSymptom(e.target.value)}
                    className="flex-1 p-2 border rounded-md"
                  >
                    <option value="">Select a symptom</option>
                    {symptomOptions.map((symptom) => (
                      <option key={symptom} value={symptom}>
                        {symptom}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => {
                      if (newSymptom && !symptoms.includes(newSymptom)) {
                        setSymptoms([...symptoms, newSymptom])
                        setNewSymptom("")
                      }
                    }}
                    className="p-2 text-indigo-600 hover:text-indigo-800"
                  >
                    <Plus size={24} />
                  </button>
                </div>
              </div>

              {/* Mood */}
              <div>
                <label htmlFor="mood" className="block text-sm font-medium text-gray-700 mb-2">
                  Mood
                </label>
                <select 
                  id="mood"
                  name="mood"
                  required
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">How are you feeling?</option>
                  <option value="happy">Happy</option>
                  <option value="sensitive">Sensitive</option>
                  <option value="irritable">Irritable</option>
                  <option value="anxious">Anxious</option>
                  <option value="calm">Calm</option>
                </select>
              </div>

              {/* Notes */}
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  className="w-full p-2 border rounded-md"
                  rows={3}
                  placeholder="Add any additional notes here..."
                />
              </div>
            </div>
          </div>

          {/* Footer with Submit Button */}
          <div className="sticky bottom-0 bg-white border-t p-4">
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors disabled:bg-indigo-400 disabled:cursor-not-allowed"
            >
              {submitting ? 'Saving...' : 'Save Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default HealthTrackingModal;