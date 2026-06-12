export function PageHeader({ title, description }: { title: string; description?: string }) {
  return (
    <header className="sticky top-0 z-10 border-b bg-background/90 px-4 py-3 backdrop-blur">
      <h1 className="font-heading text-lg font-medium">{title}</h1>
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
    </header>
  )
}
