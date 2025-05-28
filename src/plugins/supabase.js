// src/plugins/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qoikvqxwrymvwgppitco.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvaWt2cXh3cnltdndncHBpdGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxNTAzODcsImV4cCI6MjA2MTcyNjM4N30.ryhsNsvdBHenYIGeFALk1fQ18odCCOKzmrkE2Afck2A'
export const supabase = createClient(supabaseUrl, supabaseKey)
