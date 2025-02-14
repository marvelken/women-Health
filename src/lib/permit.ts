// lib/permit.ts
import { Permit } from "permitio";

// Initialize Permit with proper error handling
const initPermit = () => {
  try {
    return new Permit({
      pdp: "https://cloudpdp.api.permit.io",
      token: "permit_key_Su9ZV2uV7uPQwJ1BNlm0s3AJXQnYv5R38J4kEQBSDEhrNbSL5kwRBNWzsCAXwkOpm5ikq4vKutpMKD94Wv5hrn",
    });
  } catch (error) {
    console.error("[Permit.io] Failed to initialize:", error);
    throw error;
  }
};

const permit = initPermit();

// Define our action types
export type Actions = "viewrecordslimited" | "viewrecordsfull" | "update";

// Define our resource types
export type Resources = 
  | "HealthRecords"    // For the user's own health data
  | "ShareForm"     // For partner view

// Define our role types
export type UserRole = "user" | "partner" | "doctor" | "parent";

// Enhanced logging with timestamps
const logPermitAction = (action: string, details: any) => {
  const requestId = Math.random().toString(36).substring(7);
  const timestamp = new Date().toISOString();
  console.log(
    `[Permit.io] ${timestamp} (${requestId}) ${action}:`,
    JSON.stringify(details, null, 2)
  );
  return requestId;
};

// Verify user exists in Permit.io
export const verifyUserExists = async (userId: string): Promise<boolean> => {
  try {
    const user = await permit.api.getUser(userId);
    return !!user;
  } catch (error) {
    return false;
  }
};

// Permission check function
const check = async (action: Actions, resource: Resources, userId: string) => {
  try {
    const response = await fetch('/api/permit/check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        action,
        resource
      })
    });

    const data = await response.json();
    return data.permitted;
  } catch (error) {
    console.error('Permission check failed:', error);
    return false;
  }
};


export const checkHealthPermissions = async (userId: string) => {
  const requestId = logPermitAction("Checking health permissions", { userId });

  try {
    // Check permissions based on the defined actions
    const [canViewFull, canViewLimited] = await Promise.all([
      check("viewrecordsfull", "HealthRecords", userId),
      check("viewrecordslimited", "HealthRecords", userId)
    ]);

    const permissions = {
      canViewFull,     // For partners and parents viewing full records
      canViewLimited,  // For doctors viewing limited records
      canUpdate: await check("update", "HealthRecords", userId)
    };

    logPermitAction(`Health permissions result (${requestId})`, {
      userId,
      permissions,
    });

    return permissions;
  } catch (error) {
    console.error(
      `[Permit.io] (${requestId}) Health permissions check failed:`,
      error
    );
    return {
      canViewFull: false,
      canViewLimited: false,
      canUpdate: false
    };
  }
};

// Enhanced user sync with role management
export const syncUserToPermit = async (
    user: { id: string; email: string },
    role: UserRole
  ) => {
    const requestId = logPermitAction("Starting user sync", {
      userId: user.id,
      email: user.email,
      role,
    });
  
    try {
      // Get base URL from environment or default to localhost
      const baseUrl =  'http://localhost:3000';
      
      const response = await fetch(`${baseUrl}/api/permit/sync-users`, {  
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user, role }),
      });
  
      if (!response.ok) {
        console.log(response)
        throw new Error("Failed to sync user permissions");
      }
  
      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error("[Permit.io] Failed to sync user:", error);
      return false;
    }
  };

export default permit;