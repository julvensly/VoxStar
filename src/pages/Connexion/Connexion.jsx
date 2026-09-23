import './Connexion.css'

export default function Connexion() {
  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Se connecter</h1>
          <p>Bienvenue sur VoxStar</p>
        </div>

        <form>
          <div className="form-group">
            <label>Adresse e-mail</label>
            <input type="email" placeholder="exemple@email.com" />
          </div>

          <div className="form-group">
            <label>Mot de passe</label>
            <input type="password" placeholder="Votre mot de passe" />
          </div>

          <div className="forgot-password">
            <a href="#">Mot de passe oublié ?</a>
          </div>

          <button type="submit" className="auth-button">
            Se connecter
          </button>
        </form>

        <p className="auth-footer">
          Vous n'avez pas encore de compte ?{' '}
          <a href="/inscription">S'inscrire</a>
        </p>
      </div>
    </main>
  )
}
