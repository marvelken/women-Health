// app/api/health-records/route.ts
export async function GET(request: Request) {
    const supabase = createClient();
    const user = await supabase.auth.getUser();
  
    // Get role from Permit.io
    const role = await permit.api.getUserRole(user.id);
  
    // Filter data based on role
    let query = supabase.from('health_records').select('*');
    
    switch(role) {
      case 'doctor':
        // Show all health data
        break;
      case 'partner':
        // Filter intimate details
        query = query.select('record_date, mood, symptoms');
        break;
      case 'parent':
        // Show age-appropriate data
        query = query.select('record_date, mood');
        break;
    }
  
    const { data, error } = await query;
    // ... handle response
  }