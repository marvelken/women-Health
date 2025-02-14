"use client"

import { useState } from "react"
import { Calendar, X, Plus } from "lucide-react"

interface HealthTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function HealthTrackingModal({ isOpen, onClose }: HealthTrackingModalProps) {
  const [symptoms, setSymptoms] = useState<string[]>([])
  const [newSymptom, setNewSymptom] = useState("")

  const symptomOptions = [
    "Cramps", "Headache", "Fatigue", "Bloating", 
    "Mood Swings", "Back Pain", "Breast Tenderness"
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Track Your Health</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <form className="space-y-6">
          {/* Date Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <div className="relative">
              <input
                type="date"
                name="date"
                className="w-full p-2 border rounded-md pl-10"
              />
              <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Period Flow */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Period Flow
            </label>
            <select 
              name="flow"
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mood
            </label>
            <select 
              name="mood"
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              name="notes"
              className="w-full p-2 border rounded-md"
              rows={3}
              placeholder="Add any additional notes here..."
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Save Record
          </button>
        </form>
      </div>
    </div>
  )
}

export default HealthTrackingModal;