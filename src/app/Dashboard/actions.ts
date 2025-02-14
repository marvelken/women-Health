'use server'

import { createClient } from '../../../utils/supabase/server'
import { redirect } from 'next/navigation'


export async function getViewableRecords() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      throw new Error('Not authenticated')
    }

    // First get records shared with this user
    const { data: sharedRecords, error: sharedError } = await supabase
      .from('record_shares')
      .select('owner_id')
      .eq('shared_with_email', user.email)
      .eq('active', true)

    if (sharedError) throw sharedError

    // Get the list of owner IDs
    const ownerIds = sharedRecords.map(record => record.owner_id)

    // Then fetch actual health records
    const { data: records, error: recordsError } = await supabase
      .from('health_records')
      .select(`
        *,
        users:user_id (
          email
        )
      `)
      .or(`user_id.eq.${user.id},user_id.in.(${ownerIds.join(',')})`)

    if (recordsError) throw recordsError

    return records
  } catch (error) {
    console.error('Error fetching records:', error)
    throw error
  }
}

export async function shareRecords(formData: FormData) {
  try {
    const supabase = await createClient()
    const sharedWithEmail = formData.get('email') as string

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      throw new Error('Not authenticated')
    }

    // Check if the shared_with_email exists
    const { data: recipientData } = await supabase
      .from('auth.users')
      .select('id')
      .eq('email', sharedWithEmail)
      .single()

    if (!recipientData) {
      throw new Error('Recipient not found')
    }

    // Create sharing record
    const { error: shareError } = await supabase
      .from('record_shares')
      .insert([{
        owner_id: user.id,
        shared_with_email: sharedWithEmail,
      }])

    if (shareError) {
      throw new Error('Failed to share records')
    }

    redirect('/dashboard?shared=true')
  } catch (error) {
    console.error('Server error:', error)
    redirect('/error')
  }
}