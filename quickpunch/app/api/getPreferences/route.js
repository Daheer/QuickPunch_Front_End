import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY)

const list_of_categories = ['auto', 'business', 'economics', 'finances', 'lifestyle', 'management', 'opinions', 'politics', 'realty', 'technologies'];

export async function getPreference(email) {
  let user_preference = [];
  for (const category of list_of_categories) {
    const { data, error } = await supabase.from(category).select('id').eq('email', email);
    if (error) {
      console.log(error);
    }
    if (data && data.length > 0) {
      user_preference.push(category);
    }
  }
  return user_preference;
}

export async function POST(request) {
  const req = await request.json();
  const response = await getPreference(req.email);
  return new Response(JSON.stringify(response), { headers: { 'Content-Type': 'application/json' } });
}
