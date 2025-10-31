import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BrowserRouter, Routes, Route, Link, NavLink } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { EventsPage } from './pages/EventsPage'
import { RoutesPage } from './pages/RoutesPage'
import { InfoPage } from './pages/InfoPage'
import { AdminPage } from './pages/AdminPage'
import { LoginPage } from './pages/LoginPage'
import { ProfilePage } from './pages/ProfilePage'
import { ProtectedRoute } from './components/ProtectedRoute'
import { UserAccount } from './components/UserAccount'
import { AttractionsPage } from './pages/AttractionsPage'
import { TravelPlansPage } from './pages/TravelPlansPage'
import { RouteDetails } from './components/RouteDetails'

export function App(): React.ReactElement {
  const { t, i18n } = useTranslation()
  const [dark, setDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('dark_theme')
    return saved ? JSON.parse(saved) : false
  })
  const [auth, setAuth] = useState<{token:string; role:'tourist'|'provider'|'admin'} | null>(null)
  
  useEffect(() => {
    const root = document.documentElement
    if (dark) root.classList.add('dark'); else root.classList.remove('dark')
    localStorage.setItem('dark_theme', JSON.stringify(dark))
  }, [dark])
  
  useEffect(() => {
    const t = localStorage.getItem('auth_token')
    const r = localStorage.getItem('auth_role') as any
    if (t && r) setAuth({ token: t, role: r })
  }, [])

  const handleLoginSuccess = (token: string, role: string) => {
    localStorage.setItem('auth_token', token)
    localStorage.setItem('auth_role', role)
    setAuth({ token, role: role as any })
  }

  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_role')
    setAuth(null)
  }
  const toggleLang = () => {
    const next = i18n.language === 'hy' ? 'en' : 'hy'
    i18n.changeLanguage(next)
    try { localStorage.setItem('lng', next) } catch {}
  }
  return (
    <BrowserRouter>
      <div className="min-h-screen armenian-carpet-bg text-gray-900 dark:text-gray-100" style={{backgroundColor: dark ? '#1e293b' : '#F5F1ED'}}>
        {/* Simple Header */}
        <header className="sticky top-0 z-[100] backdrop-blur-sm bg-white/10 dark:bg-slate-900/10" style={{backgroundColor: dark ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.1)'}}>
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 px-4 py-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm group-hover:scale-105 transition-transform" style={{backgroundColor: '#BC9E82'}}>
                🇦🇲
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white hidden md:block">{t('app.name')}</span>
            </Link>

            {/* Navigation */}
            <nav className="hidden lg:flex items-center gap-6 flex-1 justify-center whitespace-nowrap">
              <NavLink 
                to="/events" 
                className={({isActive}) => `px-6 py-2 rounded-md font-medium transition-colors ${
                  isActive 
                    ? 'text-white' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                style={({isActive}) => isActive ? {backgroundColor: '#BC9E82'} : {}}
              >
                {t('nav.events')}
              </NavLink>
              <NavLink 
                to="/routes" 
                className={({isActive}) => `px-6 py-2 rounded-md font-medium transition-colors ${
                  isActive 
                    ? 'text-white' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                style={({isActive}) => isActive ? {backgroundColor: '#BC9E82'} : {}}
              >
                {t('nav.routes')}
              </NavLink>
              <NavLink 
                to="/attractions" 
                className={({isActive}) => `px-6 py-2 rounded-md font-medium transition-colors ${
                  isActive 
                    ? 'text-white' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                style={({isActive}) => isActive ? {backgroundColor: '#BC9E82'} : {}}
              >
                {t('nav.attractions', 'Attractions')}
              </NavLink>
              <NavLink 
                to="/travel-plans" 
                className={({isActive}) => `px-6 py-2 rounded-md font-medium transition-colors ${
                  isActive 
                    ? 'text-white' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                style={({isActive}) => isActive ? {backgroundColor: '#BC9E82'} : {}}
              >
                {t('nav.travelPlans')}
              </NavLink>
              <NavLink 
                to="/info" 
                className={({isActive}) => `px-6 py-2 rounded-md font-medium transition-colors ${
                  isActive 
                    ? 'text-white' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                style={({isActive}) => isActive ? {backgroundColor: '#BC9E82'} : {}}
              >
                {t('nav.info')}
              </NavLink>
              {auth?.role === 'admin' && (
                <NavLink 
                  to="/admin" 
                  className={({isActive}) => `px-6 py-2 rounded-md font-medium transition-colors ${
                    isActive 
                      ? 'text-white' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                  style={({isActive}) => isActive ? {backgroundColor: '#BC9E82'} : {}}
                >
                  {t('nav.admin')}
                </NavLink>
              )}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Language Toggle */}
              <button 
                onClick={() => { const next = i18n.language === 'hy' ? 'en' : 'hy'; i18n.changeLanguage(next); try { localStorage.setItem('lng', next) } catch {} }} 
                className="px-3 py-1 rounded-md text-white text-sm font-medium transition-colors"
                style={{backgroundColor: '#BC9E82'}}
                onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = '#A68B5B'}
                onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = '#BC9E82'}
              >
                {i18n.language === 'hy' ? 'EN' : 'HY'}
              </button>
              
              {/* Theme Toggle */}
              <button 
                onClick={() => setDark(d => !d)} 
                className="px-3 py-1 rounded-md text-white transition-colors"
                style={{backgroundColor: '#BC9E82'}}
                onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = '#A68B5B'}
                onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = '#BC9E82'}
              >
                {dark ? '☀️' : '🌙'}
              </button>

              {/* Auth */}
              {auth ? (
                <UserAccount userRole={auth.role} onLogout={handleLogout} />
              ) : (
                <NavLink 
                  to="/login" 
                  className="px-4 py-2 rounded-md text-white font-medium transition-colors"
                  style={{backgroundColor: '#BC9E82'}}
                  onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = '#A68B5B'}
                  onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = '#BC9E82'}
                >
                  {t('nav.login')}
                </NavLink>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/attractions" element={<AttractionsPage />} />
            <Route path="/travel-plans" element={<TravelPlansPage />} />
            <Route path="/routes" element={<ProtectedRoute><RoutesPage /></ProtectedRoute>} />
            <Route path="/info" element={<InfoPage />} />
            <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
            <Route path="/login" element={<LoginPage onSuccess={handleLoginSuccess} />} />
            <Route path="/profile/routes/:routeId" element={<ProtectedRoute><RouteDetails /></ProtectedRoute>} />
            <Route path="/profile/:section" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}


