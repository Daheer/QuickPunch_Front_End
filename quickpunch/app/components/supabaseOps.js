'use client';

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { redirect } from 'next/navigation';

export const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY)

export default function SupabaseAuth() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    // Try to get session from local storage
    const storedSession = JSON.parse(localStorage.getItem('supabaseSession'))
    if (storedSession) {
      setSession(storedSession)
    } else {
      // If no stored session, fetch it from Supabase
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session)
        // Save the session to local storage
        localStorage.setItem('supabaseSession', JSON.stringify(session))
      })
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      // Save the updated session to local storage
      localStorage.setItem('supabaseSession', JSON.stringify(session))
    })

    return () => subscription.unsubscribe()
  }, [])

  if (!session) {
    return (<Auth supabaseClient={supabase} theme="dark" appearance={{ theme: ThemeSupa }} />)
  } else {
    redirect('/dashboard')
  }
}

