import { Link } from 'react-router-dom'
import './MonCompte.css'

function MonCompte() {
  return (
    <main className="profile-page">
      <section className="profile-container">

        <div className="profile-icon">
          👤
        </div>

        <h1>Mon compte</h1>

        <p className="profile-description">
          Accédez à votre compte VoxStar.
        </p>

        <div className="profile-actions">

          <Link
            to="/inscription"
            className="profile-btn signup-btn"
          >
            S'inscrire
          </Link>

          <Link
            to="/connexion"
            className="profile-btn login-btn"
          >
            Se connecter
          </Link>

        </div>

      </section>
    </main>
  )
}

export default MonCompte
