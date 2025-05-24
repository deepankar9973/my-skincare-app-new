import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Ensure environment variables are set
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables!');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

// Save email subscriber
export const saveEmailSubscriber = async (email) => {
  try {
    const { error } = await supabase
      .from('email_subscribers')
      .insert({ email });

    if (error) {
      if (error.code === '23505') {
        console.warn('Email already exists in the database:', email);
        return { success: true, alreadyExists: true }; // Proceed as success
      }
      console.error('Detailed Supabase error:', JSON.stringify(error, null, 2));
      return { success: false, error };
    }

    return { success: true };
  } catch (err) {
    console.error('Unexpected error while saving email:', err);
    return { success: false, error: err };
  }
};

// Save skin analysis
export const saveAnalysis = async (analysisData) => {
  try {
    const { data, error } = await supabase
      .from('skin_analyses')
      .insert([analysisData])
      .select();

    if (error) {
      console.error('Analysis save error:', error);
      return { success: false, error };
    }

    return { success: true, data: data[0] };
  } catch (err) {
    console.error('Unexpected error while saving analysis:', err);
    return { success: false, error: err };
  }
};