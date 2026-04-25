import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://reypgzprkoalgfnrimcb.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJleXBnenBya29hbGdmbnJpbWNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5Nzc2NTEsImV4cCI6MjA5MjU1MzY1MX0.qATdjzzYC2gD9KHzFYMJWUMupQL4OxgHjapmSj3tLwg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

