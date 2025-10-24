import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { LoginPrompt } from './LoginPrompt'

type Props = { 
  children: React.ReactElement
  requireLogin?: boolean
}

export function ProtectedRoute({ children, requireLogin = false }: Props): React.ReactElement {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
  const location = useLocation()
  
  if (!token) {
    if (requireLogin) {
      return <LoginPrompt message="Please log in to access this feature" />
    }
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }
  return children
}


