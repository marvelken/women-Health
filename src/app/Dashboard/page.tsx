"use client";

import {
  Calendar,
  ChevronDown,
  LineChart,
  Activity,
  AlarmClock,
  Share2,
  Users,
  Settings,
  Mail,
  X,
  Plus,
  HeartPulse,
} from "lucide-react";
import { useState } from "react";
import HealthTrackingModal from "./components/HealthTrackingModal";

export default function UserDashboard() {
  const [showShareModal, setShowShareModal] = useState(false);
  const [showHealthTracking, setShowHealthTracking] = useState(false);

  return (
    <div className="max-w-7xl mx-auto mt-[50px]">
      {/* Header Section with Sharing */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            My Health Dashboard
          </h1>
          <p className="text-gray-600">Welcome back, Sarah</p>
        </div>
        <div className="flex space-x-4">
          {/* log for the day */}
          <button
            onClick={() => setShowHealthTracking(true)}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Log Today
          </button>

          {/* Health Tracking Modal */}
          <HealthTrackingModal
            isOpen={showHealthTracking}
            onClose={() => setShowHealthTracking(false)}
          />

          {/* share with doctor, partner, or parent modal */}
          <button
            onClick={() => setShowShareModal(true)}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <Share2 size={18} className="mr-2" />
            Share Access
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Calendar className="text-indigo-500 mr-3" size={24} />
            <div>
              <p className="text-sm text-gray-600">Next Period</p>
              <p className="text-lg font-semibold">In 14 Days</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <LineChart className="text-indigo-500 mr-3" size={24} />
            <div>
              <p className="text-sm text-gray-600">Cycle Length</p>
              <p className="text-lg font-semibold">28 Days</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Activity className="text-indigo-500 mr-3" size={24} />
            <div>
              <p className="text-sm text-gray-600">Current Phase</p>
              <p className="text-lg font-semibold">Follicular</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <HeartPulse className="text-indigo-500 mr-3" size={24} />
            <div>
              <p className="text-sm text-gray-600">Overall Health</p>
              <p className="text-lg font-semibold">Good</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Calendar</h2>
            <div className="flex items-center space-x-2">
              <button className="text-gray-500 hover:text-gray-700">
                <ChevronDown size={20} />
              </button>
            </div>
          </div>
          <div className="h-96 border rounded-lg">
            {/* Calendar Component would go here */}
            <div className="flex items-center justify-center h-full text-gray-500">
              Calendar Component
            </div>
          </div>
        </div>

        {/* Tracking and Sharing Section */}
        <div className="space-y-6">
          {/* Quick Track */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Track
            </h2>
            <div className="space-y-4">
              <button className="w-full flex items-center justify-between p-3 border rounded-md hover:bg-gray-50">
                <div className="flex items-center">
                  <AlarmClock className="text-indigo-500 mr-3" size={20} />
                  <span>Log Period</span>
                </div>
                <ChevronDown size={16} className="text-gray-400" />
              </button>

              <button className="w-full flex items-center justify-between p-3 border rounded-md hover:bg-gray-50">
                <div className="flex items-center">
                  <Activity className="text-indigo-500 mr-3" size={20} />
                  <span>Track Symptoms</span>
                </div>
                <ChevronDown size={16} className="text-gray-400" />
              </button>

              <button className="w-full flex items-center justify-between p-3 border rounded-md hover:bg-gray-50">
                <div className="flex items-center">
                  <LineChart className="text-indigo-500 mr-3" size={20} />
                  <span>Log Mood</span>
                </div>
                <ChevronDown size={16} className="text-gray-400" />
              </button>
            </div>
          </div>

          {/* Shared Access */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Shared Access
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-md">
                <div className="flex items-center">
                  <Users className="text-indigo-500 mr-3" size={20} />
                  <div>
                    <p className="font-medium">Dr. Smith</p>
                    <p className="text-sm text-gray-500">Healthcare Provider</p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <Settings size={18} />
                </button>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-md">
                <div className="flex items-center">
                  <Users className="text-indigo-500 mr-3" size={20} />
                  <div>
                    <p className="font-medium">John (Partner)</p>
                    <p className="text-sm text-gray-500">Limited Access</p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <Settings size={18} />
                </button>
              </div>

              <button
                onClick={() => setShowShareModal(true)}
                className="w-full flex items-center justify-center p-3 border border-dashed rounded-md text-gray-500 hover:text-gray-700 hover:border-gray-500"
              >
                <Plus size={20} className="mr-2" />
                Add New Share
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-xl font-semibold text-gray-900">
                Share Health Records
              </h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
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
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter their email"
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  They will only be able to see information based on their role.
                </p>
              </div>
            </div>
            <div className="flex justify-end space-x-3 px-6 py-4 bg-gray-50 rounded-b-lg">
              <button
                onClick={() => setShowShareModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Share Records
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
