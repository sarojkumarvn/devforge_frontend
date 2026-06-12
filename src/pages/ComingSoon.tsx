import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ComingSoon() {
  return (
    <main className="grid min-h-screen place-items-center px-4 py-24 text-center">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <Badge className="mx-auto" variant="secondary">DevForge</Badge>
          <CardTitle className="text-[clamp(2.6rem,10vw,5rem)]">Coming soon</CardTitle>
        </CardHeader>
        <CardContent className="text-lg text-muted-foreground">We&apos;re working on it.</CardContent>
      </Card>
    </main>
  )
}
