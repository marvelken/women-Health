"use client";

import { Users, Search, ClipboardList, Activity } from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "../../../utils/supabase/client";

interface Patient {
  id: string;
  email: string;
  latestRecord?: {
    record_date: string;
    period_flow: string;
    symptoms: string[];
    mood?: string;
    notes?: string;
    temperature?: number;
  };
  records: any[];
}

export default function DoctorDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPatients() {
      try {
        const supabase = createClient();
    
        // Get current user (doctor)
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();
        if (userError) throw userError;
        if (!user) return;
    
        // Get all shares for the current doctor
        const { data: shares, error: sharesError } = await supabase
          .from("record_shares")
          .select("owner_id, shared_with_email")
          .eq("shared_with_email", user.email)
          .eq("active", true);
    
        if (sharesError) {
          console.error("Shares error:", sharesError);
          setPatients([]);
          setLoading(false);
          return;
        }
    
        // Get user details from auth.admin
        const {
          data: { users },
          error: usersError,
        } = await supabase.auth.admin.listUsers({
          page: 1,
          perPage: 1000,
        });
    
        if (usersError) {
          console.error("Users error:", usersError);
          setPatients([]);
          setLoading(false);
          return;
        }
    
        // Map to keep track of user emails
        const userEmailMap = new Map(
          users.map((user) => [user.id, user.email])
        );
    
        // For each share, get the health records
        const patientsWithRecords = await Promise.all(
          shares.map(async (share) => {
            const { data: records, error: recordsError } = await supabase
              .from("health_records")
              .select("*")
              .eq("user_id", share.owner_id)
              .order("record_date", { ascending: false });
    
            return {
              id: share.owner_id,
              email: userEmailMap.get(share.owner_id) || "Unknown",
              latestRecord: records?.[0],
              records: records || [],
            };
          })
        );
    
        console.log("Final patients data:", patientsWithRecords);
        setPatients(patientsWithRecords);
      } catch (err) {
        console.error("Error fetching patients:", err);
        setPatients([]);
      } finally {
        setLoading(false);
      }
    }

    fetchPatients();
  }, []);

  // Filter patients based on search
  const filteredPatients = patients.filter((patient) =>
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Loading state UI
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto mt-[5%]">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 w-1/4 mb-8"></div>
          <div className="space-y-4">
            <div className="h-20 bg-gray-200 rounded-lg"></div>
            <div className="h-20 bg-gray-200 rounded-lg"></div>
            <div className="h-20 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  // Empty state UI (no patients or error)
  if (patients.length === 0) {
    return (
      <div className="max-w-7xl mx-auto mt-[5%]">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            Doctor Dashboard
          </h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Search patients..."
              className="pl-10 pr-4 py-2 border rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={20}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <div className="max-w-md mx-auto">
            <ClipboardList className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No Patient Records Yet
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              When patients share their health records with you, they will
              appear here. You'll be able to monitor their health data and
              provide better care.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard with patient data
  return (
    <div className="max-w-7xl mx-auto mt-[5%]">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Doctor Dashboard
        </h1>
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
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Your Patients
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm font-medium text-gray-500">
                  <th className="pb-4">Patient Email</th>
                  <th className="pb-4">Last Record Date</th>
                  <th className="pb-4">Current Flow</th>
                  {/* <th className="pb-4">Recent Symptoms</th> */}
                  <th className="pb-4">Mood</th>
                  <th className="pb-4">Notes</th>
                  {/* <th className="pb-4">Actions</th> */}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPatients.map((patient) => (
                  <tr key={patient.id} className="text-sm text-gray-900">
                    <td className="py-4">{patient.email}</td>
                    <td className="py-4">
                      {patient.latestRecord
                        ? new Date(
                            patient.latestRecord.record_date
                          ).toLocaleDateString()
                        : "No records"}
                    </td>
                    <td className="py-4">
                      {patient.latestRecord?.period_flow && (
                        <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs">
                          {patient.latestRecord.period_flow}
                        </span>
                      )}
                    </td>
                    {/* <td className="py-4">
                      <div className="flex flex-wrap gap-1">
                        {patient.latestRecord?.symptoms && (
                          <>
                            {patient.latestRecord.symptoms
                              .slice(0, 2)
                              .map((symptom, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs"
                                >
                                  {symptom}
                                </span>
                              ))}
                            {patient.latestRecord.symptoms.length > 2 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                                +{patient.latestRecord.symptoms.length - 2} more
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </td> */}
                    <td className="py-4">
                      {patient.latestRecord?.mood || 'N/A'}
                    </td>
                    <td className="py-4 max-w-xs truncate">
                      {patient.latestRecord?.notes || 'No notes'}
                    </td>
                    
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}