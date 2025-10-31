import React, { useMemo, useState } from 'react'

type Props = {
    onSuccess: (token: string, role: string) => void
}

export function Login({ onSuccess }: Props): React.ReactElement {
    const [email, setEmail] = useState('demo@user.am')
    const [password, setPassword] = useState('password')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
  const apiUrl = useMemo(() => (import.meta as any).env?.VITE_API_URL || '/api', [])

    const submit = async () => {
        setError('')
        setLoading(true)
        try {
            const res = await fetch(`${apiUrl}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
            })
            if (!res.ok) {
            setError('Login failed')
            return
            }
            const data = await res.json()
            onSuccess(data.token, data.user.role)
        } catch (error) {
            setError('Login failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-4">
            {/* Email Input */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <input 
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                    style={{outline: 'none'}}
                    onFocus={(e) => {e.target.style.borderColor = '#BC9E82'; e.target.style.boxShadow = '0 0 0 1px #BC9E82'}}
                    onBlur={(e) => {e.target.style.borderColor = ''; e.target.style.boxShadow = ''}} 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    placeholder="demo@user.am" 
                />
            </div>

            {/* Password Input */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                <input 
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                    style={{outline: 'none'}}
                    onFocus={(e) => {e.target.style.borderColor = '#BC9E82'; e.target.style.boxShadow = '0 0 0 1px #BC9E82'}}
                    onBlur={(e) => {e.target.style.borderColor = ''; e.target.style.boxShadow = ''}} 
                    type="password" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    placeholder="••••••••" 
                    onKeyPress={(e) => e.key === 'Enter' && submit()}
                />
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-400 px-3 py-2 rounded text-sm">
                    {error}
                </div>
            )}

            {/* Login Button */}
            <button 
                className="w-full px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
                style={{backgroundColor: '#BC9E82'}}
                onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = '#A68B5B'}
                onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = '#BC9E82'} 
                onClick={submit}
                disabled={loading}
            >
                {loading ? 'Logging in...' : 'Login'}
            </button>
        </div>
    )
}


