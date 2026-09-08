import { cn } from '#/lib/utils'

export default function MenuButton({
  isMenuOpen,
  toggleMenu,
}: {
  isMenuOpen: boolean
  toggleMenu: () => void
}) {
  return (
    <button
      onClick={toggleMenu}
      className="flex lg:hidden flex-col justify-center items-center w-8 h-8 space-y-1.5 focus:outline-none"
      aria-label="Toggle menu"
    >
      <span
        className={cn(
          'block w-6 h-0.5 bg-foreground rounded-full transition-all duration-300 ease-in-out',
          isMenuOpen && 'translate-y-2 rotate-45',
        )}
      />

      <span
        className={cn(
          'block w-6 h-0.5 bg-foreground rounded-full transition-all duration-300 ease-in-out',
          isMenuOpen ? 'opacity-0' : 'opacity-100',
        )}
      />

      <span
        className={cn(
          'block w-6 h-0.5 bg-foreground rounded-full transition-all duration-300 ease-in-out',
          isMenuOpen && '-translate-y-2 -rotate-45',
        )}
      />
    </button>
  )
}
