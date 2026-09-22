import { useNavigate } from 'react-router-dom'
import './Menu.css'

function Menu({ isOpen, onClose }) {
  const navigate = useNavigate()

  const openPage = (path) => {
    onClose()
    navigate(path)
  }

  return (
    <>
      <div
        className={`menu-overlay ${isOpen ? 'open' : ''}`}
        onClick={onClose}
      />

      <aside
        className={`menu-panel ${isOpen ? 'open' : ''}`}
      >

        <div className="menu-header">

          <h2>VOXSTAR</h2>

          <button
            className="menu-close"
            onClick={onClose}
            aria-label="Fermer le menu"
          >
            ×
          </button>

        </div>

        <nav className="menu-content">

          <button
            onClick={() => openPage('/classement')}
          >
            🏆
            <span>Classement</span>
          </button>

          <button
            onClick={() => openPage('/reglement')}
          >
            📜
            <span>Règlement du concours</span>
          </button>

          <button
            onClick={() => openPage('/contact')}
          >
            📞
            <span>Contact</span>
          </button>

          <button
            onClick={() => openPage('/devenir-candidat')}
          >
            ⭐
            <span>Comment devenir candidat ?</span>
          </button>

        </nav>

      </aside>
    </>
  )
}

export default Menu
