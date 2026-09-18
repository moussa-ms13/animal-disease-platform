import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder')) {
  console.warn(
    '[Database Architecture] Warning: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is not configured or using placeholder credentials. Running in local decoupled mode.'
  );
}

// Low-level client instance (internal to services/ abstraction layer)
export const supabase = createClient(
  supabaseUrl || 'https://placeholder-project.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key',
  {
    auth: {
      persistSession: false, // Using custom authentication system (users & roles tables)
      autoRefreshToken: false,
    },
  }
);
