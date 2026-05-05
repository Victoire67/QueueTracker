import { createClient } from "@supabase/supabase-js";
const supabaseUrl = 'https://dgpipgfetxonjjtknrvy.supabase.co';
const supabaseAnonKey ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRncGlwZ2ZldHhvbmpqdGtucnZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5MzA5MjIsImV4cCI6MjA5MzUwNjkyMn0.RPOsFBeGJzG5afIw5x279I_D63kU-C1xQqNJkna28Kw';
 
// Replace with your actual values from Supabase Settings > API
// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
