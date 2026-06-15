import { Menu, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { AuthLink } from '@/components/AuthLink'
import { Button } from '@/components/ui/button'
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { ThemeSwitcher } from '@/components/ThemeSwitcher'

const links = [
  { label: 'Explore', id: 'explore' },
  { label: 'Communities', id: 'communities' },
  { label: 'Projects', id: 'projects' },
]

export default function Navbar() {
  const scrollToSection = (id: string) => window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0)

  return (
    <header className="fixed inset-x-0 top-4 z-50 px-3">
      <nav className="mx-auto flex min-h-14 max-w-4xl items-center rounded-xl border border-border/70 bg-background/90 px-3 shadow-sm backdrop-blur">
        <Link aria-label="DevForge home" className="flex items-center gap-2 font-heading font-semibold" to="/">
          <span className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground"><Sparkles /></span>
          DevForge
        </Link>
        <div className="ml-auto hidden items-center gap-1 md:flex">
          {links.map((item) => (
            <Button key={item.label} variant="ghost" asChild>
              <Link to="/" onClick={() => scrollToSection(item.id)}>{item.label}</Link>
            </Button>
          ))}
          <ThemeSwitcher />
          <Button variant="ghost" asChild><AuthLink to="/login">Login</AuthLink></Button>
          <Button asChild><AuthLink to="/signup">Sign up</AuthLink></Button>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button className="ml-auto md:hidden" variant="ghost" size="icon" aria-label="Open navigation"><Menu /></Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>DevForge navigation</SheetTitle>
              <SheetDescription>Explore the platform or access your account.</SheetDescription>
            </SheetHeader>
            <div className="flex flex-col gap-2 px-6">
              <div className="flex items-center justify-between rounded-lg border border-border bg-muted/50 px-3 py-2">
                <span className="text-sm font-medium">Theme</span>
                <ThemeSwitcher />
              </div>
              {links.map((item) => (
                <SheetClose key={item.label} asChild>
                  <Button variant="ghost" asChild><Link to="/" onClick={() => scrollToSection(item.id)}>{item.label}</Link></Button>
                </SheetClose>
              ))}
              <SheetClose asChild><Button variant="outline" asChild><AuthLink to="/login">Login</AuthLink></Button></SheetClose>
              <SheetClose asChild><Button asChild><AuthLink to="/signup">Sign up</AuthLink></Button></SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  )
}
