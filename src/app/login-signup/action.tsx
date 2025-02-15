'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '../../../utils/supabase/server'
import { syncUserToPermit, verifyUserExists, type UserRole } from '../../lib/permit'

export async function login(formData: FormData) {
    const supabase = await createClient()

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { error, data: userData } = await supabase.auth.signInWithPassword(data)

    if (error) {
        console.error("Login error:", error);
        redirect('/error')
    }

    if (userData?.user) {
        // Check if user has a role in Permit.io
        const hasRole = await verifyUserExists(userData.user.id)
        
        if (!hasRole) {
            redirect('/select-role')
        }
    }

    revalidatePath('/', 'layout')
    redirect('/Dashboard')
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { error, data: userData } = await supabase.auth.signUp(data)

    if (error) {
        console.error("Signup error:", error);
        redirect('/error')
    }

    // After feeling the form, the user will be redirected to the verification page
    redirect('/verify')
}

export async function selectRole(formData: FormData) {
    const supabase = await createClient()
    const role = formData.get('role') as UserRole

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
        redirect('/login-signup')
    }

    // Use the existing syncUserToPermit function
    const success = await syncUserToPermit(
        { id: user.id, email: user.email },
        role
    )

    if (!success) {
        console.error('Failed to sync user role')
        redirect('/error')
    }

    // Redirect based on role
    switch (role) {
        case 'user':
            redirect('/Dashboard')
        case 'partner':
            redirect('/PatnerDashboard')
        case 'doctor':
            redirect('/DoctorDashboard')
        case 'parent':
            redirect('/Dashboard')
        default:
            redirect('/Dashboard')
    }
}


























// 'use server'

// import { revalidatePath } from 'next/cache'
// import { redirect } from 'next/navigation'
// import { createClient } from '../../../utils/supabase/server'
// // import permit, { syncUserToPermit } from '../../lib/permit'

// export async function login(formData: FormData) {
//     const supabase = await createClient()

//     const data = {
//         email: formData.get('email') as string,
//         password: formData.get('password') as string,
//     }

//     const { error, data: userData } = await supabase.auth.signInWithPassword(data)

//     if (error) {
//         console.error("Login error:", error);
//         redirect('/error')
//     }

//     // if (userData?.user) {
//     //     // Sync user data on login
//     //     await syncUserToPermit(userData.user)
//     // }

//     revalidatePath('/', 'layout')
//     redirect('/')
// }

// export async function signup(formData: FormData) {
//     const supabase = await createClient()

//     const data = {
//         email: formData.get('email') as string,
//         password: formData.get('password') as string,
//     }

//     const { error, data: userData } = await supabase.auth.signUp(data)

//     if (error) {
//         console.error("Signup error:", error);
//         redirect('/error')
//     }

//     // if (userData?.user) {
//     //     // Sync new user with Permit.io
//     //     const syncResult = await syncUserToPermit(userData.user)
        
//     //     if (!syncResult) {
//     //         console.error("Failed to sync user with Permit.io");
//     //         // You might want to handle this case differently
//     //     }
//     // }

//     revalidatePath('/', 'layout')
//     redirect('/')
// }





