import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { supabase } from "../config/supabase"



const LoginPage = () => {
    
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [authError, setAuthError] = useState(null)
    const navigate = useNavigate()

    const handleLogin = async (event) => {
        event.preventDefault()
        setLoading(true)
        const { error } = await supabase.auth.signInWithPassword({email, password})
        if (error) {
            setAuthError(error.message)
        } else {
            navigate('/')
        }
        setLoading(false)
    }
    return (
        <div>
            <p>Sign in to your account</p>
            {authError && <p>{authError}</p>}
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Your email"
                    value={email}
                    required={true}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Your password"
                    value={password}
                    required={true}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button disabled={loading}>
                    {loading ? <span>Loading</span> : <span>Sign in</span>}
                </button>
            </form>
        </div>
    )
}

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