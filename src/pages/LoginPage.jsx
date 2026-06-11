import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { supabase } from "../config/supabase"



const LoginPage = () => {
    
    const [isSignUp, setIsSignUp] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [authError, setAuthError] = useState(null)
    const [signUpSuccess, setSignUpSuccess] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (event) => {
        event.preventDefault()
        setLoading(true)

        if (isSignUp) {
            const { error } = await supabase.auth.signUp({email, password})
            if (error) {
                setAuthError(error.message)
                setSignUpSuccess(false)
            } else {
                setAuthError(null)
                setSignUpSuccess(true)
            }
            setLoading(false)
            return
        }
        else{
            const { error } = await supabase.auth.signInWithPassword({email, password})
            if (error) {
                setAuthError(error.message)
            } else {
                navigate('/')
            }
            setLoading(false)
        }
    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="w-full max-w-sm p-8 bg-white rounded-xl shadow-md">
                <h1 className="text-2xl font-bold mb-6">
                    {isSignUp ? 'Create an account' : 'Sign in'}
                </h1>
                {authError && <p className="text-red-500 text-sm mb-4">{authError}</p>}
                {signUpSuccess && <p className="text-green-600 text-sm mb-4">Check your email to confirm your account!</p>}
                {!signUpSuccess && (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <input
                            type="email"
                            placeholder="Your email"
                            value={email}
                            required
                            onChange={(e) => setEmail(e.target.value)}
                            className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        <input
                            type="password"
                            placeholder="Your password"
                            value={password}
                            required
                            onChange={(e) => setPassword(e.target.value)}
                            className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        <button
                            disabled={loading}
                            className="bg-green-500 text-white rounded-lg py-2 text-sm font-medium hover:bg-green-600 disabled:opacity-50"
                        >
                            {loading ? 'Loading...' : isSignUp ? 'Sign up' : 'Sign in'}
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsSignUp(!isSignUp)}
                            className="text-sm text-gray-500 hover:text-gray-700"
                        >
                            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}

export default LoginPage