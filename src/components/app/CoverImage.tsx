import { ImageIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

type CoverImageProps = {
  src?: string
  alt: string
  className?: string
}

export function CoverImage({ src, alt, className }: CoverImageProps) {
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    setFailed(false)
  }, [src])

  return (
    <div
      className={cn(
        'relative grid overflow-hidden bg-muted text-muted-foreground',
        className,
      )}
    >
      {src && !failed ? (
        <img className="size-full object-cover outline outline-1 -outline-offset-1 outline-black/10 dark:outline-white/10" src={src} alt={alt} onError={() => setFailed(true)} />
      ) : (
        <div className="grid size-full place-items-center" role="img" aria-label={`${alt} placeholder`}>
          <ImageIcon className="size-8 opacity-60" />
        </div>
      )}
    </div>
  )
}
