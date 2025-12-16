import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { API_ENDPOINTS } from '../config/api'

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token')
    if (token) {
      navigate('/chat')
    }
  }, [navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const endpoint = isLogin ? API_ENDPOINTS.auth.login : API_ENDPOINTS.auth.register
      const body = isLogin
        ? { email, password }
        : { email, password, name: name || undefined }

      console.log('🔵 [FRONTEND] Calling API:', endpoint)
      console.log('🔵 [FRONTEND] Request body:', { ...body, password: '***' })
      console.log('🔵 [FRONTEND] Full URL:', endpoint)

      let response
      try {
        response = await fetch(endpoint, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        })
        console.log('🔵 [FRONTEND] Response received!')
        console.log('🔵 [FRONTEND] Status:', response.status, response.statusText)
        console.log('🔵 [FRONTEND] Headers:', Object.fromEntries(response.headers.entries()))
      } catch (fetchError) {
        console.error('❌ [FRONTEND] Fetch failed:', fetchError)
        console.error('❌ [FRONTEND] Error type:', fetchError.constructor.name)
        console.error('❌ [FRONTEND] Error message:', fetchError.message)
        throw new Error(`Network error: Cannot connect to backend. ${fetchError.message}`)
      }

      let data
      try {
        const text = await response.text()
        console.log('🔵 [FRONTEND] Response text:', text)
        data = JSON.parse(text)
        console.log('🔵 [FRONTEND] Parsed data:', data)
      } catch (parseError) {
        console.error('❌ [FRONTEND] JSON parse error:', parseError)
        throw new Error(`Invalid response from server. Status: ${response.status}`)
      }

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong')
      }

      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      navigate('/chat')
    } catch (err) {
      console.error('❌ API Error:', err)
      if (err instanceof TypeError && err.message.includes('fetch')) {
        setError('Cannot connect to backend server. Make sure it\'s running on http://localhost:8000')
      } else {
        setError(err instanceof Error ? err.message : 'Something went wrong')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl text-center">
            AI Chatbot
          </CardTitle>
          <CardDescription className="text-center">
            {isLogin ? 'Sign in to continue' : 'Create an account to get started'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Name (optional)
                </label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                />
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                {error}
              </div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Loading...' : isLogin ? 'Sign In' : 'Sign Up'}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => {
                setIsLogin(!isLogin)
                setError('')
              }}
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

