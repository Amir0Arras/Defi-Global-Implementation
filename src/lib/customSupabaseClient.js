import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gbxmqlngtdmfatolnkpo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdieG1xbG5ndGRtZmF0b2xua3BvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4OTIzNDQsImV4cCI6MjA4MDQ2ODM0NH0.HldEYz73lNVndSYi43ZN_JVxewkz_4mYZV9oSlTGOrk';

const customSupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export default customSupabaseClient;

export { 
    customSupabaseClient,
    customSupabaseClient as supabase,
};
