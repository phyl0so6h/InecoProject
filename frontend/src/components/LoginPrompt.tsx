import React from 'react'
import { Link } from 'react-router-dom'

interface Props {
  message?: string
}

export function LoginPrompt({ message = "Please log in to access this feature" }: Props): React.ReactElement {
  return (
    <div className="max-w-md mx-auto text-center py-12">
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <div className="mb-4">
          <svg className="w-12 h-12 mx-auto text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
          Login Required
        </h2>
        <p className="text-blue-700 dark:text-blue-300 mb-4">
          {message}
        </p>
        <Link
          to="/login"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          Go to Login
        </Link>
      </div>
    </div>
  )
}
