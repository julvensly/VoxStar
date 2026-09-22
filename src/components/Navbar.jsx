import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Navbar.css'

import Menu from './Menu/Menu'

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">

          <button
            className="navbar-back"
            onClick={() => navigate(-1)}
            aria-label="Retour"
          >
            ←
          </button>

          <div className="navbar-logo">
            VOXSTAR
          </div>

          <div className="navbar-actions">

            <button
              className="navbar-menu"
              onClick={() => setIsMenuOpen(true)}
              aria-label="Ouvrir le menu"
            >
              ☰
            </button>

          </div>

        </div>
      </nav>

      <Menu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
    </>
  )
}

export default Navbar
