import { motion } from 'framer-motion'
import { BookOpen, Boxes, Globe2, LucideIcon, UserRound } from 'lucide-react'
import { AuthLink } from '@/components/AuthLink'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const features = [
  { title: 'Developer Profiles', badge: 'Identity', description: 'Showcase your stack, featured repositories, public writing, and current build status in one polished developer profile.', icon: UserRound, rows: ['Maya Chen', 'React · Rust · Edge APIs', 'Building: WASM profiler'], metrics: ['42 repos', '18 posts'], action: 'View profile', reverse: false },
  { title: 'Blogs & Projects', badge: 'Publishing', description: 'Turn launches, build notes, and technical discoveries into sharp project stories that other developers can follow.', icon: BookOpen, rows: ['Launch note drafted', 'Architecture diagram attached', 'Review queue ready'], metrics: ['8 min read', '3 tags'], action: 'Publish story', reverse: true },
  { title: 'Global Feed', badge: 'Discovery', description: 'Browse a fast-moving stream of releases, learnings, experiments, and open collaboration opportunities from builders worldwide.', icon: Globe2, rows: ['Aarav shipped an AI search demo', 'Lina opened a design system audit', 'Noah needs GraphQL cache feedback'], metrics: ['Live feed', '26 updates'], action: 'Explore feed', reverse: false },
  { title: 'Communities', badge: 'Network', description: 'Join focused rooms around frontend systems, AI products, open source, career growth, and deep technical interests.', icon: Boxes, rows: ['Frontend Ops', 'AI Builders', 'Open Source Maintainers'], metrics: ['14 rooms', '2.4k builders'], action: 'Join rooms', reverse: true },
]

export default function Features() {
  return (
    <section id="explore" className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-screen-xl">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <Badge>Platform</Badge>
          <h2 className="mt-5 font-heading text-[clamp(2.1rem,5vw,3.6rem)] font-medium leading-tight tracking-[-0.04em]">Everything developers need to be discovered.</h2>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">Profiles, publishing, feeds, and communities composed from one consistent product system.</p>
        </div>
        <div className="flex flex-col gap-16">
          {features.map((feature) => (
            <motion.article key={feature.title} id={feature.title === 'Blogs & Projects' ? 'projects' : feature.title === 'Communities' ? 'communities' : undefined} className={cn('flex flex-col gap-8 md:items-center md:gap-10', feature.reverse ? 'md:flex-row-reverse' : 'md:flex-row')} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.35 }}>
              <div className="w-full md:w-1/2"><FeatureVisual feature={feature} /></div>
              <div className="w-full md:w-1/2">
                <Badge variant="secondary">{feature.badge}</Badge>
                <h3 className="mt-4 font-heading text-[clamp(1.8rem,4vw,2.8rem)] font-medium leading-tight tracking-[-0.04em]">{feature.title}</h3>
                <p className="mt-4 max-w-xl text-lg leading-8 text-muted-foreground">{feature.description}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

function FeatureVisual({ feature }: { feature: (typeof features)[number] }) {
  const Icon = feature.icon as LucideIcon
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <span className="grid size-12 place-items-center rounded-2xl bg-muted text-primary"><Icon /></span>
          <div><CardTitle>{feature.title}</CardTitle><CardDescription>{feature.badge}</CardDescription></div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {feature.rows.map((row) => <div key={row} className="rounded-2xl bg-muted p-4 text-sm font-medium">{row}</div>)}
      </CardContent>
      <CardFooter className="flex justify-between gap-3">
        <div className="flex gap-2">{feature.metrics.map((metric) => <Badge key={metric} variant="outline">{metric}</Badge>)}</div>
        <Button size="sm" asChild><AuthLink to="/signup">{feature.action}</AuthLink></Button>
      </CardFooter>
    </Card>
  )
}
