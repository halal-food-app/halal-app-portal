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

export default LoginPage