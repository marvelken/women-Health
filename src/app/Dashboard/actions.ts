// src/app/Dashboard/actions.ts
'use server'

import { createClient } from '../../../utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addHealthRecord(formData: FormData) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      throw new Error('Not authenticated')
    }

    // Get form data
    const record = {
      user_id: user.id,
      record_date: formData.get('date'),
      period_flow: formData.get('flow'),
      symptoms: formData.getAll('symptoms'),
      mood: formData.get('mood'),
      notes: formData.get('notes'),
    }

    const { error } = await supabase
      .from('health_records')
      .insert([record])

    if (error) throw error

    revalidatePath('/Dashboard')
    return { success: true }
  } catch (error) {
    console.error('Error adding health record:', error)
    return { success: false, error }
  }
}

export async function getHealthRecords() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      throw new Error('Not authenticated')
    }

    const { data, error } = await supabase
      .from('health_records')
      .select('*')
      .eq('user_id', user.id)
      .order('record_date', { ascending: false })

    if (error) throw error

    return data
  } catch (error) {
    console.error('Error fetching health records:', error)
    return []
  }
}