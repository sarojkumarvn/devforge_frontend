import { Github, Linkedin, Twitter } from 'lucide-react'
import { Link } from 'react-router-dom'
import { AuthLink } from '@/components/AuthLink'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

const sectionLinks = [
  { label: 'Explore', id: 'explore' },
  { label: 'Projects', id: 'projects' },
  { label: 'Communities', id: 'communities' },
]

const socials = [
  { label: 'GitHub', icon: Github, href: 'https://github.com' },
  { label: 'Twitter', icon: Twitter, href: 'https://x.com' },
  { label: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com' },
]

export default function Footer() {
  const scrollToSection = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  return (
    <footer className="border-t border-border/70 bg-background px-4 py-12 sm:px-6 md:py-16 lg:px-8">
      <div className="mx-auto grid max-w-screen-xl gap-10 text-center md:grid-cols-2 md:text-left lg:grid-cols-3">
        <div>
          <Link to="/" className="inline-flex min-h-11 items-center font-heading text-2xl font-medium">DevForge</Link>
          <p className="mt-3 max-w-sm text-sm leading-7 text-muted-foreground">Developer profiles, publishing, feeds, and communities in one focused network.</p>
        </div>
        <div>
          <h3 className="font-heading text-sm font-medium">Product</h3>
          <div className="mt-4 grid gap-2">
            {sectionLinks.map((item) => (
              <Button key={item.id} variant="link" className="justify-center md:justify-start" onClick={() => scrollToSection(item.id)}>
                {item.label}
              </Button>
            ))}
            <Button variant="link" className="justify-center md:justify-start" asChild><AuthLink to="/login">Login</AuthLink></Button>
            <Button variant="link" className="justify-center md:justify-start" asChild><AuthLink to="/signup">Create account</AuthLink></Button>
          </div>
        </div>
        <div className="lg:text-right">
          <h3 className="font-heading text-sm font-medium">Social</h3>
          <div className="mt-5 flex justify-center gap-3 md:justify-start lg:justify-end">
            {socials.map(({ label, icon: Icon, href }) => (
              <Button key={label} aria-label={label} variant="outline" size="icon" asChild>
                <a href={href} target="_blank" rel="noreferrer"><Icon /></a>
              </Button>
            ))}
          </div>
        </div>
      </div>
      <Separator className="mx-auto mt-10 max-w-screen-xl" />
      <p className="mx-auto mt-6 max-w-screen-xl text-center text-xs text-muted-foreground">© 2026 DevForge.</p>
    </footer>
  )
}
