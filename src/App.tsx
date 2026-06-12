import { ReactNode, useEffect, useRef } from 'react'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ThemeProvider } from 'next-themes'
import { AppShell } from './components/app/AppShell'
import { LoadingOverlay } from './components/LoadingOverlay'
import Navbar from './components/Navbar'
import { Toaster } from './components/ui/sonner'
import { TooltipProvider } from './components/ui/tooltip'
import { AuthProvider, useAuth } from './context/AuthContext'
import { LoadingTransitionProvider, useLoadingTransition } from './context/LoadingTransitionContext'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Bookmarks from './pages/app/Bookmarks'
import Communities from './pages/app/Communities'
import CommunityDetail from './pages/app/CommunityDetail'
import CreatePost from './pages/app/CreatePost'
import Explore from './pages/app/Explore'
import HomeFeed from './pages/app/HomeFeed'
import { MessagesPage, NotificationsPage } from './pages/app/Unsupported'
import PostDetail from './pages/app/PostDetail'
import Profile from './pages/app/Profile'
import Settings from './pages/app/Settings'
export default function App() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
      storageKey="devforge.appearance"
    >
      <TooltipProvider>
        <AuthProvider>
          <HashRouter>
            <LoadingTransitionProvider>
              <div className="theme relative min-h-screen overflow-x-hidden bg-background text-foreground">
                <Routes>
                  <Route path="/" element={<MarketingShell><Landing /></MarketingShell>} />
                  <Route path="/signup" element={<SansSerifShell><MarketingShell><Signup /></MarketingShell></SansSerifShell>} />
                  <Route path="/login" element={<SansSerifShell><MarketingShell><Login /></MarketingShell></SansSerifShell>} />
                  <Route path="/app" element={<Protected><SansSerifShell><AppShell><HomeFeed /></AppShell></SansSerifShell></Protected>} />
                  <Route path="/app/explore" element={<Protected><SansSerifShell><AppShell><Explore /></AppShell></SansSerifShell></Protected>} />
                  <Route path="/app/communities" element={<Protected><SansSerifShell><AppShell><Communities /></AppShell></SansSerifShell></Protected>} />
                  <Route path="/app/communities/:id" element={<Protected><SansSerifShell><AppShell><CommunityDetail /></AppShell></SansSerifShell></Protected>} />
                  <Route path="/app/posts/:id" element={<Protected><SansSerifShell><AppShell><PostDetail /></AppShell></SansSerifShell></Protected>} />
                  <Route path="/app/bookmarks" element={<Protected><SansSerifShell><AppShell><Bookmarks /></AppShell></SansSerifShell></Protected>} />
                  <Route path="/app/profile" element={<Protected><SansSerifShell><AppShell><Profile /></AppShell></SansSerifShell></Protected>} />
                  <Route path="/app/profile/:id" element={<Protected><SansSerifShell><AppShell><Profile /></AppShell></SansSerifShell></Protected>} />
                  <Route path="/app/create" element={<Protected><SansSerifShell><AppShell><CreatePost /></AppShell></SansSerifShell></Protected>} />
                  <Route path="/app/settings" element={<Protected><SansSerifShell><AppShell><Settings /></AppShell></SansSerifShell></Protected>} />
                  <Route path="/app/notifications" element={<Protected><SansSerifShell><AppShell><NotificationsPage /></AppShell></SansSerifShell></Protected>} />
                  <Route path="/app/messages" element={<Protected><SansSerifShell><AppShell><MessagesPage /></AppShell></SansSerifShell></Protected>} />
                </Routes>
                <LoadingOverlay />
                <Toaster position="top-right" closeButton richColors />
              </div>
            </LoadingTransitionProvider>
          </HashRouter>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  )
}

function MarketingShell({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  )
}

function SansSerifShell({ children }: { children: ReactNode }) {
  return <div className="app-sans min-h-screen font-sans">{children}</div>
}

function Protected({ children }: { children: ReactNode }) {
  const { token, loading } = useAuth()
  const { start, finish } = useLoadingTransition()
  const restoredSession = useRef(false)

  useEffect(() => {
    if (loading) {
      restoredSession.current = true
      start('Restoring your session...')
    } else if (restoredSession.current) {
      restoredSession.current = false
      void finish()
    }
  }, [finish, loading, start])

  if (loading) return <div className="min-h-screen bg-background" />
  if (!token) return <Navigate to="/login" replace />
  return <>{children}</>
}
