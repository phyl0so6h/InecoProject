import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

type Props = {
  userRole: string
  onLogout: () => void
}

export function UserAccount({ userRole, onLogout }: Props): React.ReactElement {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1 rounded-md border hover:bg-neutral-100 dark:hover:bg-neutral-800"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        {t('profile.account')}
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-md shadow-lg z-50">
          <div className="p-2">
            <Link
              to="/profile"
              className="block px-3 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              {t('profile.myProfile')}
            </Link>
            <Link
              to="/profile/events"
              className="block px-3 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              {t('profile.myEvents')}
            </Link>
            <Link
              to="/profile/routes"
              className="block px-3 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              {t('profile.savedRoutes')}
            </Link>
            <Link
              to="/profile/joined"
              className="block px-3 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              {t('profile.joinedPlans')}
            </Link>
            {(userRole === 'provider' || userRole === 'admin') && (
              <Link
                to="/profile/create-event"
                className="block px-3 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-md"
                onClick={() => setIsOpen(false)}
              >
                {t('profile.createEvent')}
              </Link>
            )}
            <div className="border-t border-neutral-200 dark:border-neutral-700 my-1"></div>
            <button
              onClick={() => {
                onLogout()
                setIsOpen(false)
              }}
              className="block w-full text-left px-3 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-md text-red-600"
            >
              {t('profile.logout')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
