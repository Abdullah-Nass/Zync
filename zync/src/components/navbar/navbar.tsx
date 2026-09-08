import Logo from '@/assets/logo.png'
import { Link } from '@tanstack/react-router'
import MenuButton from './menu-button'
import ProfileDropdown from './profile-dropdown'
import SearchBar from './search-bar'

export default function Navbar({
  isMenuOpen,
  toggleMenu,
}: {
  isMenuOpen: boolean
  toggleMenu: () => void
}) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container mx-auto flex h-[65px] items-center justify-between px-5 md:px-16">
        <Link to="/feed" className="flex items-center gap-3 justify-center">
          <img src={Logo} alt="zync-logo" className="w-10 h-10" />
          <span className="text-primary text-2xl font-bold hidden lg:block">
            Zync
          </span>
        </Link>

        <div className="flex items-center gap-2 md:gap-4">
          <SearchBar />
          <div className="hidden lg:block">
            <ProfileDropdown />
          </div>
          <MenuButton isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
        </div>
      </div>
    </header>
  )
}
