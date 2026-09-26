import { useNavigate } from 'react-router-dom'
import './Parametres.css'

export default function Parametres() {
  const navigate = useNavigate()

  const closePanel = () => {
    navigate('/profile')
  }

  const logout = () => {
    localStorage.removeItem('voxstar_token')
    localStorage.removeItem('voxstar_user')

    navigate('/connexion', { replace: true })
  }

  return (
    <>
      <div
        className="settings-overlay"
        onClick={closePanel}
      />

      <aside className="settings-panel">

        <header className="settings-header">

          <button
            className="settings-back"
            onClick={closePanel}
            aria-label="Retour"
          >
            ←
          </button>

          <h1>Paramètres</h1>

          <button
            className="settings-close"
            onClick={closePanel}
            aria-label="Fermer"
          >
            ×
          </button>

        </header>

        <div className="settings-content">

          <button
            className="settings-item"
            onClick={() => navigate('/parametres/profil')}
          >
            <span className="settings-icon">👤</span>
            <span className="settings-text">
              Modifier le profil
            </span>
            <span className="settings-arrow">
              ›
            </span>
          </button>

          <button
            className="settings-item"
            onClick={() => navigate('/parametres/informations')}
          >
            <span className="settings-icon">ℹ️</span>
            <span className="settings-text">
              Mes informations
            </span>
            <span className="settings-arrow">
              ›
            </span>
          </button>

          <button
            className="settings-item"
            onClick={() => navigate('/parametres/statut')}
          >
            <span className="settings-icon">🟢</span>
            <span className="settings-text">
              Statut
            </span>
            <span className="settings-arrow">
              ›
            </span>
          </button>

          <button
            className="settings-item settings-logout"
            onClick={logout}
          >
            <span className="settings-icon">🚪</span>
            <span className="settings-text">
              Se déconnecter
            </span>
          </button>

        </div>

      </aside>
    </>
  )
}
