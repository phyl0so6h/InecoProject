import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Login } from '../components/Login'

type Props = {
  onSuccess: (token: string, role: string) => void
}

export function LoginPage({ onSuccess }: Props): React.ReactElement {
  const { t } = useTranslation()
  const apiUrl = useMemo(() => (import.meta as any).env?.VITE_API_URL || '/api', [])
  const navigate = useNavigate()
  
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t('routes.login')}</h1>
          <p className="text-gray-600 dark:text-gray-400">{t('routes.loginDescription')}</p>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
          <Login onSuccess={async (tkn) => {
            // decode role from backend by calling /profile
            try {
              const res = await fetch(`${apiUrl}/profile`, { headers: { Authorization: `Bearer ${tkn}` } })
              const data = await res.json()
              if (data?.user?.role) {
                onSuccess(tkn, data.user.role)
                // Redirect to home page after successful login
                navigate('/')
              }
            } catch (error) {
              console.error('Failed to get user role:', error)
            }
          }} />
        </div>

        {/* Additional Info */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Demo: demo@user.am / password
          </p>
        </div>
      </div>
    </div>
  )
}


