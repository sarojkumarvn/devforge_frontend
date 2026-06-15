import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const testimonials = [
  { name: 'Maya Chen', handle: '@mayacodes', quote: 'DevForge makes my project updates feel like a real builder journal, not a forgotten profile page.' },
  { name: 'Aarav Singh', handle: '@aaravbuilds', quote: 'The community-first layout is exactly how developer platforms should feel in 2026.' },
  { name: 'Noah Kim', handle: '@noahships', quote: 'I can imagine moving from a launch note to a discussion without losing context.' },
  { name: 'Lina Patel', handle: '@linaui', quote: 'The visual language gives technical work the same polish as product launches.' },
  { name: 'Mateo Ruiz', handle: '@mateodev', quote: 'Profiles, feeds, projects, and communities all belong in one place.' },
  { name: 'Iris Novak', handle: '@irisinfra', quote: 'The static prototype already feels like a credible home for serious builders.' },
]

export default function Testimonials() {
  return (
    <section className="overflow-hidden px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto mb-10 max-w-screen-xl">
        <Badge variant="secondary">Community signals</Badge>
        <h2 className="mt-4 max-w-3xl text-balance font-heading text-[clamp(2.1rem,5vw,3.4rem)] font-medium leading-tight tracking-[-0.04em]">Built for developers who ship in public.</h2>
      </div>
      <div className="flex flex-col gap-4 overflow-hidden">
        <MarqueeRow cards={testimonials.slice(0, 4)} direction="left" />
        <MarqueeRow cards={testimonials.slice(2)} direction="right" />
      </div>
    </section>
  )
}

function MarqueeRow({ cards, direction }: { cards: typeof testimonials; direction: 'left' | 'right' }) {
  return <div className="overflow-hidden"><div className={cn('flex w-max gap-4', direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right')}>{[...cards, ...cards].map((item, index) => <TestimonialCard key={`${item.handle}-${index}`} testimonial={item} />)}</div></div>
}

function TestimonialCard({ testimonial }: { testimonial: (typeof testimonials)[number] }) {
  const initials = testimonial.name.split(' ').map((part) => part[0]).join('')
  return (
    <Card className="w-72 shrink-0">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Avatar><AvatarFallback>{initials}</AvatarFallback></Avatar>
          <div><CardTitle>{testimonial.name}</CardTitle><p className="text-xs text-muted-foreground">{testimonial.handle}</p></div>
        </div>
      </CardHeader>
      <CardContent className="line-clamp-3 text-pretty leading-6 text-muted-foreground">{testimonial.quote}</CardContent>
    </Card>
  )
}
