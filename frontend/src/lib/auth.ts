import { getSupabaseClient } from './supabase'
import type { User, Session } from '@supabase/supabase-js'

export interface AuthUser extends User {
  email: string
  user_metadata: {
    name?: string
    avatar_url?: string
  }
}

export interface SignUpData {
  email: string
  password: string
  name: string
}

export interface SignInData {
  email: string
  password: string
}

// Sign up with email and password
export async function signUp({ email, password, name }: SignUpData) {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  })

  if (error) throw error
  return data
}

// Sign in with email and password
export async function signIn({ email, password }: SignInData) {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error
  return data
}

// Sign in with Google OAuth
export async function signInWithGoogle() {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  })

  if (error) throw error
  return data
}

// Sign out
export async function signOut() {
  const supabase = getSupabaseClient()
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// Get current session
export async function getSession(): Promise<Session | null> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.auth.getSession()
  if (error) throw error
  return data.session
}

// Get current user
export async function getCurrentUser(): Promise<AuthUser | null> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.auth.getUser()
  if (error) throw error
  return data.user as AuthUser | null
}

// Reset password
export async function resetPassword(email: string) {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  })

  if (error) throw error
  return data
}

// Update password
export async function updatePassword(newPassword: string) {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  })

  if (error) throw error
  return data
}

// Listen to auth state changes
export function onAuthStateChange(callback: (session: Session | null) => void) {
  const supabase = getSupabaseClient()
  return supabase.auth.onAuthStateChange((_event, session) => {
    callback(session)
  })
}
