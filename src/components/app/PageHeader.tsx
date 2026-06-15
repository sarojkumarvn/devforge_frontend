export function PageHeader({ title, description }: { title: string; description?: string }) {
  return (
    <header className="sticky top-0 z-10 border-b border-border/70 bg-background/90 px-4 py-4 backdrop-blur">
      <div className="mx-auto max-w-screen-2xl">
        <h1 className="text-balance font-heading text-lg font-medium">{title}</h1>
        {description && <p className="text-pretty text-sm text-muted-foreground">{description}</p>}
      </div>
    </header>
  )
}
