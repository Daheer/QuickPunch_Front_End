import { supabase } from '../getPreferences/route.js';

async function get_n_reads(email, subscriptions) {
  let n_reads = 0;
  for (const sub of subscriptions) {
    const { data, error } = await supabase.from(sub).select('n_reads').eq('email', email);
    if (error) {
      console.log(error);
    }
    if (data) {
      n_reads += data[0].n_reads;
    }
  }
  return n_reads;
}

export async function POST(request) {
  const req = await request.json();
  const response = await get_n_reads(req.email, req.preferences);
  return new Response(JSON.stringify(response), { headers: { 'Content-Type': 'application/json' } });
}