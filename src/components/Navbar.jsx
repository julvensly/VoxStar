import { useEffect, useState } from 'react'
import {
  useLocation,
  useNavigate
} from 'react-router-dom'

import './Navbar.css'
import Menu from './Menu/Menu'

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 5)
    }

    window.addEventListener(
      'scroll',
      handleScroll
    )

    handleScroll()

    return () => {
      window.removeEventListener(
        'scroll',
        handleScroll
      )
    }
  }, [])

  const handleBack = () => {
    const currentPath =
      location.pathname

    if (currentPath === '/') {
      return
    }

    if (currentPath === '/profile') {
      navigate('/', {
        replace: true
      })

      return
    }

    if (window.history.length <= 1) {
      navigate('/', {
        replace: true
      })

      return
    }

    navigate(-1)
  }

  return (
    <>
      <div className="navbar-slot">

        <nav
          className={`navbar ${
            isScrolled
              ? 'navbar-scrolled'
              : ''
          }`}
        >

          <div className="navbar-container">

            <button
              type="button"
              className="navbar-back"
              onClick={handleBack}
              aria-label="Retour"
            >
              ←
            </button>

            <div className="navbar-logo">
              VOXSTAR
            </div>

            <div className="navbar-actions">

              <button
                type="button"
                className="navbar-menu"
                onClick={() =>
                  setIsMenuOpen(true)
                }
                aria-label="Ouvrir le menu"
              >
                ☰
              </button>

            </div>

          </div>

        </nav>

      </div>

      <Menu
        isOpen={isMenuOpen}
        onClose={() =>
          setIsMenuOpen(false)
        }
      />
    </>
  )
}

export default Navbar
