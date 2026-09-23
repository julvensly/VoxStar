import './Inscription.css'

export default function Inscription() {
  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Créer un compte</h1>
          <p>Rejoignez VoxStar</p>
        </div>

        <form>
          <div className="form-group">
            <label>Nom complet</label>
            <input type="text" placeholder="Votre nom complet" />
          </div>

          <div className="form-group">
            <label>Adresse e-mail</label>
            <input type="email" placeholder="exemple@email.com" />
          </div>

          <div className="form-group">
            <label>Mot de passe</label>
            <input type="password" placeholder="Votre mot de passe" />
          </div>

          <div className="form-group">
            <label>Confirmer le mot de passe</label>
            <input type="password" placeholder="Confirmez votre mot de passe" />
          </div>

          <button type="submit" className="auth-button">
            S'inscrire
          </button>
        </form>

        <p className="auth-footer">
          Vous avez déjà un compte ?{' '}
          <a href="/connexion">Se connecter</a>
        </p>
      </div>
    </main>
  )
}
