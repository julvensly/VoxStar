import { useNavigate } from 'react-router-dom'
import './MotDePasse.css'

export default function MotDePasse() {
  const navigate = useNavigate()

  return (
    <main className="password-page">

      <header className="sub-settings-header">

        <button
          onClick={() => navigate('/parametres/informations')}
          className="sub-settings-back"
        >
          ←
        </button>

        <h1>Modifier le mot de passe</h1>

        <div className="sub-settings-space" />

      </header>

      <section className="password-content">

        <div className="password-field">
          <label>Mot de passe actuel</label>
          <input type="password" />
        </div>

        <div className="password-field">
          <label>Nouveau mot de passe</label>
          <input type="password" />
        </div>

        <div className="password-field">
          <label>Confirmer le nouveau mot de passe</label>
          <input type="password" />
        </div>

        <button className="save-password-button">
          Modifier le mot de passe
        </button>

      </section>

    </main>
  )
}
