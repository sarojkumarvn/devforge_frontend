import {
  Bell,
  Bookmark,
  Compass,
  Home,
  LogOut,
  Mail,
  Menu,
  MessageSquarePlus,
  Search,
  Settings,
  Sparkles,
  Users,
  UserRound,
} from 'lucide-react'
import { FormEvent, KeyboardEvent, PointerEvent as ReactPointerEvent, ReactNode, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar'
import { AvatarName } from './AvatarName'
import { DiscoveryRail } from './DiscoveryRail'
import { ThemeSwitcher } from '@/components/ThemeSwitcher'

const primaryNav = [
  { label: 'Home', to: '/app', icon: Home },
  { label: 'Explore', to: '/app/explore', icon: Compass },
  { label: 'Communities', to: '/app/communities', icon: Users },
]

const personalNav = [
  { label: 'Notifications', to: '/app/notifications', icon: Bell },
  { label: 'Messages', to: '/app/messages', icon: Mail },
  { label: 'Bookmarks', to: '/app/bookmarks', icon: Bookmark },
  { label: 'Profile', to: '/app/profile', icon: UserRound },
  { label: 'Settings', to: '/app/settings', icon: Settings },
]

const routeTitles = [
  { path: '/app/explore', title: 'Explore' },
  { path: '/app/communities', title: 'Communities' },
  { path: '/app/posts', title: 'Post' },
  { path: '/app/bookmarks', title: 'Bookmarks' },
  { path: '/app/profile', title: 'Profile' },
  { path: '/app/create', title: 'Create post' },
  { path: '/app/settings', title: 'Settings' },
  { path: '/app/notifications', title: 'Notifications' },
  { path: '/app/messages', title: 'Messages' },
]

const LAYOUT_STORAGE_KEY = 'devforge.feed-layout'
const DEFAULT_LAYOUT = { left: 25, right: 25 }
const MIN_RAIL_WIDTH = 15
const MAX_RAIL_WIDTH = 35
const MIN_FEED_WIDTH = 35

type FeedLayout = typeof DEFAULT_LAYOUT

export function AppShell({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [search, setSearch] = useState('')
  const [layout, setLayout] = useState<FeedLayout>(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(LAYOUT_STORAGE_KEY) ?? '')
      if (typeof stored.left === 'number' && typeof stored.right === 'number') {
        return normalizeLayout(stored)
      }
    } catch {
      // Use the default layout when local storage is empty or invalid.
    }
    return DEFAULT_LAYOUT
  })

  const title = routeTitles.find((route) => location.pathname.startsWith(route.path))?.title ?? 'Dashboard'

  useEffect(() => {
    localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(layout))
  }, [layout])

  const signOut = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const submitSearch = (event: FormEvent) => {
    event.preventDefault()
    const query = search.trim()
    navigate(query ? `/app/explore?q=${encodeURIComponent(query)}` : '/app/explore')
  }

  return (
    <SidebarProvider
      className="h-svh min-h-0 overflow-hidden bg-muted/50 xl:[--sidebar-width:var(--desktop-left-width)]"
      style={{
        '--sidebar-width': '13rem',
        '--sidebar-width-icon': '4rem',
        '--desktop-left-width': `${layout.left}vw`,
        '--discovery-width': `${layout.right}vw`,
      } as React.CSSProperties}
    >
      <Sidebar collapsible="icon">
        <SidebarHeader className="p-3">
          <Link className="flex h-10 items-center gap-3 rounded-xl px-2 font-heading font-semibold" to="/app">
            <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-primary text-sm text-primary-foreground">
              <Sparkles />
            </span>
            <span className="text-lg group-data-[collapsible=icon]:hidden">DevForge</span>
          </Link>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Workspace</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <AppNavigation items={primaryNav} pathname={location.pathname} />
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <div className="px-3 group-data-[collapsible=icon]:px-2">
            <CreatePostButton />
          </div>

          <SidebarGroup>
            <SidebarGroupLabel>Your account</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <AppNavigation items={personalNav} pathname={location.pathname} />
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarSeparator />
        <SidebarFooter className="p-3">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild tooltip="View profile">
                <Link to="/app/profile">
                  <AvatarName user={user} size="sm" />
                  <span className="min-w-0">
                    <span className="block truncate font-medium">{user?.userName ?? 'Account'}</span>
                    <span className="block truncate text-xs text-muted-foreground">{user?.location ?? 'View profile'}</span>
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <div className="flex items-center justify-between group-data-[collapsible=icon]:flex-col">
            <ThemeSwitcher />
            <Button variant="ghost" size="icon-sm" onClick={signOut} aria-label="Log out" title="Log out">
              <LogOut />
            </Button>
          </div>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <SidebarInset className="h-svh min-h-0 overflow-hidden">
        <header className="flex h-16 shrink-0 items-center gap-3 border-b bg-background/95 px-3 backdrop-blur sm:px-5">
          <SidebarTrigger className="hidden md:inline-flex" />
          <MobileSidebarTrigger />

          <div className="min-w-0">
            <p className="truncate font-heading text-base font-semibold sm:text-lg">{title}</p>
            <p className="hidden text-xs text-muted-foreground sm:block">Build, share, and discover developer work</p>
          </div>

          <form className="ml-auto hidden w-full max-w-xs lg:block" onSubmit={submitSearch}>
            <InputGroup>
              <InputGroupAddon><Search /></InputGroupAddon>
              <InputGroupInput
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search DevForge..."
                aria-label="Search DevForge"
              />
            </InputGroup>
          </form>

          <Button className="hidden sm:inline-flex" size="sm" asChild>
            <Link to="/app/create"><MessageSquarePlus data-icon="inline-start" /> Create</Link>
          </Button>

          <Button className="lg:hidden" variant="ghost" size="icon-sm" asChild>
            <Link to="/app/explore" aria-label="Search DevForge"><Search /></Link>
          </Button>

          <Button variant="ghost" size="icon-sm" asChild>
            <Link to="/app/notifications" aria-label="Notifications"><Bell /></Link>
          </Button>

          <DiscoveryDrawer />

          <ThemeSwitcher />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open account menu">
                <AvatarName user={user} size="sm" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{user?.userName ?? 'Account'}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild><Link to="/app/profile"><UserRound /> Profile</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/app/settings"><Settings /> Settings</Link></DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onSelect={signOut} variant="destructive"><LogOut /> Log out</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <div className="grid min-h-0 flex-1 grid-cols-1 xl:grid-cols-[minmax(0,1fr)_0.5rem_var(--discovery-width)]">
          <main className="min-w-0 overflow-y-auto overscroll-contain bg-background" id="main-feed" tabIndex={-1}>
            {children}
          </main>
          <ResizeHandle
            label="Resize discovery sidebar"
            value={layout.right}
            onChange={(right) => setLayout((current) => normalizeLayout({ ...current, right }))}
            direction="right"
          />
          <aside className="hidden min-h-0 overflow-y-auto border-l bg-muted/20 p-5 xl:block" aria-label="Discover DevForge">
            <DiscoveryRail />
          </aside>
        </div>
      </SidebarInset>
      <LeftResizeHandle
        value={layout.left}
        onChange={(left) => setLayout((current) => normalizeLayout({ ...current, left }))}
      />
    </SidebarProvider>
  )
}

function normalizeLayout(layout: FeedLayout): FeedLayout {
  const left = clamp(layout.left, MIN_RAIL_WIDTH, MAX_RAIL_WIDTH)
  const right = clamp(layout.right, MIN_RAIL_WIDTH, MAX_RAIL_WIDTH)
  const overflow = Math.max(0, left + right + MIN_FEED_WIDTH - 100)

  if (overflow === 0) return { left, right }
  if (left >= right) return { left: left - overflow, right }
  return { left, right: right - overflow }
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value))
}

function LeftResizeHandle({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  const { state } = useSidebar()
  if (state === 'collapsed') return null

  return (
    <ResizeHandle
      className="fixed inset-y-0 hidden w-2 xl:flex"
      label="Resize navigation sidebar"
      value={value}
      onChange={onChange}
      direction="left"
      style={{ left: `calc(${value}vw - 0.25rem)` }}
    />
  )
}

function ResizeHandle({
  className = 'hidden xl:flex',
  direction,
  label,
  onChange,
  style,
  value,
}: {
  className?: string
  direction: 'left' | 'right'
  label: string
  onChange: (value: number) => void
  style?: React.CSSProperties
  value: number
}) {
  const startResize = (event: ReactPointerEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'

    const move = (pointerEvent: globalThis.PointerEvent) => {
      const percentage = direction === 'left'
        ? (pointerEvent.clientX / window.innerWidth) * 100
        : ((window.innerWidth - pointerEvent.clientX) / window.innerWidth) * 100
      onChange(percentage)
    }

    const stop = () => {
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', stop)
      window.removeEventListener('pointercancel', stop)
    }

    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', stop)
    window.addEventListener('pointercancel', stop)
  }

  const resizeWithKeyboard = (event: KeyboardEvent<HTMLButtonElement>) => {
    const decrease = direction === 'left' ? 'ArrowLeft' : 'ArrowRight'
    const increase = direction === 'left' ? 'ArrowRight' : 'ArrowLeft'
    if (event.key !== decrease && event.key !== increase && event.key !== 'Home') return
    event.preventDefault()
    onChange(event.key === 'Home' ? 25 : value + (event.key === increase ? 1 : -1))
  }

  return (
    <button
      type="button"
      role="separator"
      aria-label={label}
      aria-orientation="vertical"
      aria-valuemin={MIN_RAIL_WIDTH}
      aria-valuemax={MAX_RAIL_WIDTH}
      aria-valuenow={Math.round(value)}
      className={`${className} z-20 cursor-col-resize touch-none items-center justify-center bg-transparent outline-none after:h-12 after:w-1 after:rounded-full after:bg-border hover:after:bg-primary focus-visible:after:bg-primary`}
      style={style}
      onDoubleClick={() => onChange(25)}
      onKeyDown={resizeWithKeyboard}
      onPointerDown={startResize}
      title="Drag to resize. Double-click to reset."
    />
  )
}

function AppNavigation({
  items,
  pathname,
}: {
  items: typeof primaryNav
  pathname: string
}) {
  const { setOpenMobile } = useSidebar()

  return items.map((item) => (
    <SidebarMenuItem key={item.to}>
      <SidebarMenuButton
        asChild
        isActive={item.to === '/app' ? pathname === item.to : pathname.startsWith(item.to)}
        tooltip={item.label}
      >
        <Link to={item.to} onClick={() => setOpenMobile(false)}>
          <item.icon />
          <span>{item.label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  ))
}

function CreatePostButton() {
  const navigate = useNavigate()
  const { setOpenMobile } = useSidebar()

  return (
    <Button
      className="w-full group-data-[collapsible=icon]:px-0"
      onClick={() => {
        setOpenMobile(false)
        navigate('/app/create')
      }}
      aria-label="Create post"
    >
      <MessageSquarePlus data-icon="inline-start" />
      <span className="group-data-[collapsible=icon]:hidden">Create post</span>
    </Button>
  )
}

function MobileSidebarTrigger() {
  const { toggleSidebar } = useSidebar()
  return (
    <Button className="md:hidden" variant="ghost" size="icon-sm" onClick={toggleSidebar} aria-label="Open navigation">
      <Menu />
    </Button>
  )
}

function DiscoveryDrawer() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="xl:hidden" variant="ghost" size="icon-sm" aria-label="Open discovery">
          <Compass />
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto p-0" side="right">
        <SheetHeader className="border-b">
          <SheetTitle>Discover DevForge</SheetTitle>
          <SheetDescription>Trending work, developers, and communities.</SheetDescription>
        </SheetHeader>
        <div className="p-4"><DiscoveryRail /></div>
      </SheetContent>
    </Sheet>
  )
}
