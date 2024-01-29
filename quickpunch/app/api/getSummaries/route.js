import { supabase } from '../getPreferences/route.js';
import { getPreference } from '../getPreferences/route.js';

async function getSummariesForCategory(category) {
  const { data, error } = await supabase.from("entries").select("summary").eq("category", category);
  if (error) {
    console.log(error);
  }
  if (data && data.length > 0) {
    for (let i = 0; i < data.length; i++) {
      data[i] = data[i].summary;
    }
    return data;
  }
  return [];
}

async function getSummaries(email) {
  const preferences = await getPreference(email);
  const summaries = {};
  for (const category of preferences) {
    summaries[category] = await getSummariesForCategory(category.charAt(0).toUpperCase() + category.slice(1));
  }
  return summaries;
}

export async function POST(request) {
  const req = await request.json();
  const response = await getSummaries(req.email);
  return new Response(JSON.stringify(response), { headers: { 'Content-Type': 'application/json' } });
}
