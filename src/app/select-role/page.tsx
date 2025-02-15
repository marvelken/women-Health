"use client"

import { selectRole } from "../login-signup/action"
import { UserCircle2, Heart, Stethoscope, Users } from "lucide-react"

export default function SelectRolePage() {
  return (
    <>
      <div className="p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Tell us why you're here
        </h2>
        
        <div className="space-y-4">
          {/* Track My Health */}
          <form>
            <input type="hidden" name="role" value="user" />
            <button
              formAction={selectRole}
              type="submit"
              className="w-full flex items-center p-4 border border-gray-300 rounded-md hover:border-indigo-500 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
            >
              <UserCircle2 className="text-gray-400 mr-3" size={24} />
              <div className="text-left">
                <div className="text-sm font-medium text-gray-900">Track My Health</div>
                <div className="text-sm text-gray-500">Monitor your menstrual cycle and health data</div>
              </div>
            </button>
          </form>

          {/* Partner Access */}
          <form>
            <input type="hidden" name="role" value="partner" />
            <button
              formAction={selectRole}
              type="submit"
              className="w-full flex items-center p-4 border border-gray-300 rounded-md hover:border-indigo-500 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
            >
              <Heart className="text-gray-400 mr-3" size={24} />
              <div className="text-left">
                <div className="text-sm font-medium text-gray-900">Partner Access</div>
                <div className="text-sm text-gray-500">Support your partner's health journey</div>
              </div>
            </button>
          </form>

          {/* Healthcare Provider */}
          <form>
            <input type="hidden" name="role" value="doctor" />
            <button
              formAction={selectRole}
              type="submit"
              className="w-full flex items-center p-4 border border-gray-300 rounded-md hover:border-indigo-500 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
            >
              <Stethoscope className="text-gray-400 mr-3" size={24} />
              <div className="text-left">
                <div className="text-sm font-medium text-gray-900">Healthcare Provider</div>
                <div className="text-sm text-gray-500">Monitor and manage patient health data</div>
              </div>
            </button>
          </form>

          {/* Parent Access */}
          <form>
            <input type="hidden" name="role" value="parent" />
            <button
              formAction={selectRole}
              type="submit"
              className="w-full flex items-center p-4 border border-gray-300 rounded-md hover:border-indigo-500 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
            >
              <Users className="text-gray-400 mr-3" size={24} />
              <div className="text-left">
                <div className="text-sm font-medium text-gray-900">Parent Access</div>
                <div className="text-sm text-gray-500">Monitor your child's health data</div>
              </div>
            </button>
          </form>
        </div>
      </div>

      <div className="px-8 py-4 bg-gray-50 border-t border-gray-200">
        <p className="text-sm text-center text-gray-600">
          Choose a role that best describes your purpose. You can't change this later.
        </p>
      </div>
    </>
  )
}