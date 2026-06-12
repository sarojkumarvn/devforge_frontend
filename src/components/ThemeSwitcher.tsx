import { Laptop, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const themes = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Laptop },
]

export function ThemeSwitcher() {
  const { theme = 'light', resolvedTheme, setTheme } = useTheme()
  const ActiveIcon = resolvedTheme === 'dark' ? Moon : Sun

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label="Choose appearance" title="Choose appearance">
          <ActiveIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-44">
        <DropdownMenuLabel>Appearance</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
            {themes.map((item) => (
              <DropdownMenuRadioItem key={item.value} value={item.value}>
                <item.icon />
                {item.label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
