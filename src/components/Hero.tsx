import { motion } from 'framer-motion'
import { Code2, GitBranch, MessageSquare, Terminal, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { AuthLink } from '@/components/AuthLink'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden px-4 pb-14 pt-28 sm:px-6 lg:px-8">
      <div className="absolute left-1/2 top-20 size-[34rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" aria-hidden="true" />
      <div className="mx-auto w-full max-w-screen-xl">
        <motion.div className="mx-auto max-w-5xl text-center" initial="hidden" animate="visible" transition={{ staggerChildren: 0.12 }}>
          <motion.div variants={fadeUp}><Badge variant="secondary">Developer network for the next web</Badge></motion.div>
          <motion.h1 variants={fadeUp} className="mx-auto mt-5 max-w-4xl font-heading text-[clamp(3rem,8vw,6rem)] font-medium leading-[0.92] tracking-[-0.05em]">
            Build. Share. <span className="text-primary">Connect.</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            Create a profile, publish project stories, follow a global feed, and discover focused developer communities.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" asChild><AuthLink to="/signup">Start building</AuthLink></Button>
            <Button size="lg" variant="outline" onClick={() => document.getElementById('explore')?.scrollIntoView({ behavior: 'smooth' })}>Explore features</Button>
          </motion.div>
        </motion.div>

        <motion.div className="mx-auto mt-12 grid w-full max-w-5xl gap-4 md:grid-cols-[1.3fr_0.9fr]" initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.35 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Terminal /> /global-feed</CardTitle>
              <CardDescription>Recent work from developers across DevForge.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {['Published a Rust WASM profiler', 'Shipped a design system audit', 'Opened a GraphQL cache deep dive'].map((item, index) => (
                <div key={item}>
                  {index > 0 && <Separator className="mb-3" />}
                  <div className="flex items-start gap-3"><Code2 className="text-primary" /><div><p className="font-medium">{item}</p><p className="text-sm text-muted-foreground">Project update · just now</p></div></div>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="hidden md:flex">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">Communities <Users /></CardTitle>
              <CardDescription>Focused spaces for builders.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {[[ 'Frontend Ops', GitBranch ], [ 'AI Builders', MessageSquare ], [ 'Open Source', Code2 ]].map(([label, Icon]) => (
                <div key={label as string} className="flex items-center gap-3 rounded-2xl bg-muted p-3"><Icon /><span className="font-medium">{label as string}</span></div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
