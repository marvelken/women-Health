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
import HealthRecordsDisplay from "./components/HealthRecordsDisplay";
import ShareModal from "./components/ShareModal";
import ActiveShares from "./components/ActiveShares";

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
            <h2 className="text-lg font-semibold text-gray-900">
              Health Records
            </h2>
          </div>
          <HealthRecordsDisplay />
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
              <ActiveShares />
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
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
      />
    </div>
  );
}
