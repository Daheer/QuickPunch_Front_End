// import { createClient } from '@supabase/supabase-js'

// const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY)

import { supabase } from '../getPreferences/route.js';

const list_of_categories = ['auto', 'business', 'economics', 'finances', 'lifestyle', 'management', 'opinions', 'politics', 'realty', 'technologies'];

export async function POST(request) {
  const req = await request.json();
  const preferences = req.preferences
  for (const category of list_of_categories) {
    if (preferences.includes(category)) {
      const { data, error } = await supabase.from(category).upsert([{ email: req.email }]);
    } else {
      const { data, error } = await supabase.from(category).delete().eq('email', req.email);
      if (error) {
        console.log(error);
      }
    }
  }
  return new Response(JSON.stringify('OK'), { headers: { 'Content-Type': 'application/json' } });
}
