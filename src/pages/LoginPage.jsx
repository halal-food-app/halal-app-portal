import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '../config/supabase'

export default function LoginPage() {
  const navigate = useNavigate()

  useEffect(() => {
    console.log('LoginPage mounted')
    console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL)

    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()
      console.log('session:', session)
      console.log('session error:', error)

      if (session) {
        navigate('/')
      }
    }

    checkSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('auth event:', event, session)

      if (event === 'SIGNED_IN' && session) {
        navigate('/')
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [navigate])

  return (
    <div style={{ minHeight: '100vh', padding: '2rem', backgroundColor: 'white' }}>
      <h1 style={{ color: 'black' }}>Login Page Test</h1>

      <div style={{ maxWidth: '420px' }}>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={[]}
        />
      </div>
    </div>
  )
}