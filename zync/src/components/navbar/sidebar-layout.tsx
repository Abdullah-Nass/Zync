import { useState } from 'react'
import Navbar from './navbar'
import Sidebar from './sidebar'
import { useStore } from '@nanostores/react'
import { $authLoading } from '#/lib/auth'
import Loading from '../loading'

export default function SidebarLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const loading = useStore($authLoading)
  if (loading) return <Loading />
  return (
    <>
      <Navbar
        isMenuOpen={isMobileMenuOpen}
        toggleMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />
      <Sidebar
        isOpen={isMobileMenuOpen}
        closeMenu={() => setIsMobileMenuOpen(false)}
      />
    </>
  )
}
