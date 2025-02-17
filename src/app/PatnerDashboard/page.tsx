"use client";

import { Heart, Search, Activity, Calendar } from "lucide-react";
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
  };
  records: any[];
}

interface Permissions {
  canViewFull: boolean;
  canViewLimited: boolean;
  canUpdate: boolean;
}

export default function PartnerDashboard() {
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
    
        // Get current user (partner)
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

        // Check if user has permission to view partner records
        if (!userPermissions.canViewLimited && !userPermissions.canViewFull) {
          throw new Error('Insufficient permissions to view partner records');
        }
    
        // Get all shares for the current partner
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
            <div className="h-32 bg-gray-200 rounded-lg"></div>
            <div className="h-32 bg-gray-200 rounded-lg"></div>
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

  // Empty state UI
  if (patients.length === 0) {
    return (
      <div className="max-w-7xl mx-auto mt-[5%]">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 flex items-center">
            <Heart className="mr-3 text-pink-500" size={28} />
            Partner Dashboard
          </h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Search partner's records..."
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
            <Heart className="mx-auto h-12 w-12 text-pink-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No Shared Health Records
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              When your partner shares their health records with you, they will
              appear here. This helps you understand and support their health journey.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard with partner data
  return (
    <div className="max-w-7xl mx-7  mt-[5%]">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 flex items-center">
          <Heart className="mr-3 text-pink-500" size={28} />
          Partner Dashboard
        </h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search records..."
            className="pl-10 pr-4 py-2 border rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>
      </div>

      {/* Records Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPatients.map((patient) => (
          <div 
            key={patient.id} 
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            {/* Record Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center space-x-3">
                <Heart className="text-pink-500" size={24} />
                <span className="text-sm font-medium text-gray-700">
                  {patient.email}
                </span>
              </div>
              <Calendar 
                className="text-gray-400" 
                size={20} 
              />
            </div>

            {/* Record Content */}
            <div className="p-4">
              {patient.latestRecord ? (
                <>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Last Update:</strong> {new Date(patient.latestRecord.record_date).toLocaleDateString()}
                  </p>
                  
                  {patient.latestRecord.period_flow && (
                    <div className="mb-2">
                      <span className="inline-block px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs">
                        Flow: {patient.latestRecord.period_flow}
                      </span>
                    </div>
                  )}

                  {patient.latestRecord.symptoms && patient.latestRecord.symptoms.length > 0 && (
                    <div className="mb-2">
                      <p className="text-sm text-gray-600 mb-1">Symptoms:</p>
                      <div className="flex flex-wrap gap-1">
                        {patient.latestRecord.symptoms.map((symptom, index) => (
                          <span 
                            key={index} 
                            className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs"
                          >
                            {symptom}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {permissions?.canViewFull && (
                    <>
                      {patient.latestRecord.mood && (
                        <div className="mb-2 flex items-center">
                          <Activity className="mr-2 text-gray-400" size={18} />
                          <span className="text-sm text-gray-600">
                            Mood: {patient.latestRecord.mood}
                          </span>
                        </div>
                      )}

                      {patient.latestRecord.notes && (
                        <div className="mt-2 p-2 bg-gray-50 rounded-md">
                          <p className="text-sm text-gray-600 italic">
                            {patient.latestRecord.notes}
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </>
              ) : (
                <div className="text-center text-gray-500">
                  No records available
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}