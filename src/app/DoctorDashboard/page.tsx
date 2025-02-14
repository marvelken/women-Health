"use client"

import { Users, Search, ClipboardList } from "lucide-react"
import { useState } from "react"

export default function DoctorDashboard({ patients = [] }) {
  const [searchTerm, setSearchTerm] = useState("")

  // Empty state when no patients have shared their records
  if (patients.length === 0) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Doctor Dashboard</h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Search patients..."
              className="pl-10 pr-4 py-2 border rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>
        </div>

        {/* Empty State */}
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <div className="max-w-md mx-auto">
            <ClipboardList className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No Patient Records Yet</h3>
            <p className="mt-2 text-sm text-gray-500">
              When patients share their health records with you, they will appear here. 
              You'll be able to monitor their health data and provide better care.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Dashboard with patient data
  return (
    <div className="max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Doctor Dashboard</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search patients..."
            className="pl-10 pr-4 py-2 border rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>
      </div>

      {/* Patient List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Patients</h2>
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm font-medium text-gray-500">
                <th className="pb-4">Patient Name</th>
                <th className="pb-4">Last Visit</th>
                <th className="pb-4">Cycle Status</th>
                <th className="pb-4">Health Concerns</th>
                <th className="pb-4">Actions</th>
              </tr>
            </thead>
            {/* <tbody className="divide-y divide-gray-200">
              {patients.map((patient) => (
                <tr key={patient.id} className="text-sm text-gray-900">
                  <td className="py-4">{patient.name}</td>
                  <td className="py-4">{patient.lastVisit}</td>
                  <td className="py-4">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      {patient.cycleStatus}
                    </span>
                  </td>
                  <td className="py-4">{patient.concerns}</td>
                  <td className="py-4">
                    <button className="text-indigo-600 hover:text-indigo-900">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody> */}
          </table>
        </div>
      </div>
    </div>
  )
}