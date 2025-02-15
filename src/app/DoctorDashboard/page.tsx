"use client";

import { Users, Search, ClipboardList, Activity } from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "../../../utils/supabase/client";
import { checkHealthPermissions } from "../../lib/permit";
import { useRouter } from 'next/navigation';

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

interface Permissions {
  canViewFull: boolean;
  canViewLimited: boolean;
  canUpdate: boolean;
}

export default function DoctorDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [permissions, setPermissions] = useState<Permissions | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

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
        if (!user) {
          router.push('/login-signup');
          return;
        }

        // Get user permissions
        const userPermissions = await checkHealthPermissions(user.id);
        setPermissions(userPermissions);

        // Check if user has permission to view patient records
        if (!userPermissions.canViewLimited && !userPermissions.canViewFull) {
          throw new Error('Insufficient permissions to view patient records');
        }
    
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
            // Determine which columns to select based on permissions
            let query = supabase
              .from("health_records")
              .select('*')
              .eq("user_id", share.owner_id)
              .order("record_date", { ascending: false });

            // If user only has limited view, restrict columns
            if (!userPermissions.canViewFull && userPermissions.canViewLimited) {
              query = supabase
                .from("health_records")
                .select('id, record_date, period_flow, symptoms')
                .eq("user_id", share.owner_id)
                .order("record_date", { ascending: false });
            }

            const { data: records, error: recordsError } = await query;
    
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
      } catch (err: any) {
        console.error("Error fetching patients:", err);
        setError(err.message);
        setPatients([]);
      } finally {
        setLoading(false);
      }
    }

    fetchPatients();
  }, [router]);

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

  // Error state
  if (error) {
    return (
      <div className="max-w-7xl mx-auto mt-[5%] p-4 bg-red-50 text-red-600 rounded-lg">
        {error}
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
                  {permissions?.canViewFull && (
                    <>
                      <th className="pb-4">Mood</th>
                      <th className="pb-4">Notes</th>
                    </>
                  )}
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
                    {permissions?.canViewFull && (
                      <>
                        <td className="py-4">
                          {patient.latestRecord?.mood || 'N/A'}
                        </td>
                        <td className="py-4 max-w-xs truncate">
                          {patient.latestRecord?.notes || 'No notes'}
                        </td>
                      </>
                    )}
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