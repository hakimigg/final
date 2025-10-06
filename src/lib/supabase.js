import { createClient } from '@supabase/supabase-js'

// Supabase project credentials
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://uaumotnyxnxvjpfkagau.supabase.co'
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhdW1vdG55eG54dmpwZmthZ2F1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0ODQxODMsImV4cCI6MjA3NTA2MDE4M30.Lw8uf_1DYXyFksimlAjyj0GANMYVMeIxsWkYEz8F0LM'

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export { supabase };

// Table name constants
export const PRODUCTS_TABLE = 'products'
export const TYPES_TABLE = 'types'
