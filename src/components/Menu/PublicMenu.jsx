import { useNavigate } from 'react-router-dom'
import './Menu.css'

function PublicMenu({ onClose }) {
  const navigate = useNavigate()

  const openPage = (path) => {
    onClose()
    navigate(path)
  }

  return (
    <aside className="menu-panel open">

      <div className="menu-header">

        <img
          src="/Start.png"
          alt="VoxStar"
          className="menu-logo"
        />

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
          className="menu-profile"
          onClick={() =>
            openPage('/mon-compte')
          }
        >
          <span className="menu-profile-icon">
            👤
          </span>

          <span>Mon compte</span>
        </button>

        <button
          onClick={() =>
            openPage('/reglement')
          }
        >
          📜
          <span>
            Règlement du concours
          </span>
        </button>

        <button
          onClick={() =>
            openPage('/contact')
          }
        >
          📞
          <span>Contact</span>
        </button>

      </nav>
    </aside>
  )
}

export default PublicMenu
