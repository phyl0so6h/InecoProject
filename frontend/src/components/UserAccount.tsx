import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { createPortal } from 'react-dom'

type Props = {
  userRole: string
  onLogout: () => void
}

export function UserAccount({ userRole, onLogout }: Props): React.ReactElement {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.right - 192 + window.scrollX // 192px is the width of the dropdown
      })
    }
  }, [isOpen])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      const dropdown = document.querySelector('[data-dropdown="user-account"]')
      
      // Check if click is outside both button and dropdown
      if (
        buttonRef.current && 
        !buttonRef.current.contains(target) &&
        (!dropdown || !dropdown.contains(target))
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      // Use setTimeout to avoid immediate closure on button click
      const timeoutId = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside, true)
      }, 0)
      
      return () => {
        clearTimeout(timeoutId)
        document.removeEventListener('mousedown', handleClickOutside, true)
      }
    }
  }, [isOpen])

  const dropdownContent = isOpen && (
    <div 
      data-dropdown="user-account"
      className="fixed w-52 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50 rounded-xl shadow-2xl z-[999999]"
      style={{
        top: position.top,
        left: position.left
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-3 space-y-1">
        <Link
          to="/profile"
          className="flex items-center gap-3 px-4 py-3 text-sm text-gray-900 dark:text-gray-200 hover:bg-[#BC9E82]/10 dark:hover:bg-[#BC9E82]/20 rounded-lg transition-all duration-200 group"
          onClick={(e) => {
            e.preventDefault()
            setIsOpen(false)
            navigate('/profile')
          }}
        >
          <svg className="w-4 h-4 text-[#BC9E82]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          {t('profile.myProfile')}
        </Link>
        <Link
          to="/profile/events"
          className="flex items-center gap-3 px-4 py-3 text-sm text-gray-900 dark:text-gray-200 hover:bg-[#BC9E82]/10 dark:hover:bg-[#BC9E82]/20 rounded-lg transition-all duration-200 group"
          onClick={(e) => {
            e.preventDefault()
            setIsOpen(false)
            navigate('/profile/events')
          }}
        >
          <svg className="w-4 h-4 text-[#BC9E82]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {t('profile.myEvents')}
        </Link>
        <Link
          to="/profile/routes"
          className="flex items-center gap-3 px-4 py-3 text-sm text-gray-900 dark:text-gray-200 hover:bg-[#BC9E82]/10 dark:hover:bg-[#BC9E82]/20 rounded-lg transition-all duration-200 group"
          onClick={(e) => {
            e.preventDefault()
            setIsOpen(false)
            navigate('/profile/routes')
          }}
        >
          <svg className="w-4 h-4 text-[#BC9E82]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          {t('profile.savedRoutes')}
        </Link>
        <Link
          to="/profile/joined"
          className="flex items-center gap-3 px-4 py-3 text-sm text-gray-900 dark:text-gray-200 hover:bg-[#BC9E82]/10 dark:hover:bg-[#BC9E82]/20 rounded-lg transition-all duration-200 group"
          onClick={(e) => {
            e.preventDefault()
            setIsOpen(false)
            navigate('/profile/joined')
          }}
        >
          <svg className="w-4 h-4 text-[#BC9E82]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          {t('profile.joinedPlans')}
        </Link>
        {(userRole === 'provider' || userRole === 'admin') && (
          <Link
            to="/profile/create-event"
            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-900 dark:text-gray-200 hover:bg-[#BC9E82]/10 dark:hover:bg-[#BC9E82]/20 rounded-lg transition-all duration-200 group"
            onClick={(e) => {
              e.preventDefault()
              setIsOpen(false)
              navigate('/profile/create-event')
            }}
          >
            <svg className="w-4 h-4 text-[#BC9E82]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            {t('profile.createEvent')}
          </Link>
        )}
        <div className="border-t border-gray-200/50 dark:border-gray-600/50 my-2"></div>
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onLogout()
            setIsOpen(false)
          }}
          className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 group"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          {t('profile.logout')}
        </button>
      </div>
    </div>
  )

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={(e) => {
          e.stopPropagation()
          setIsOpen(!isOpen)
        }}
        className="flex items-center gap-2 px-3 py-1 rounded-md text-white transition-colors"
        style={{backgroundColor: '#BC9E82'}}
        onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = '#A68B5B'}
        onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = '#BC9E82'}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        {t('profile.account')}
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {dropdownContent && createPortal(dropdownContent, document.body)}
    </div>
  )
}
