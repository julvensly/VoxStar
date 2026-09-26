import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../../services/api'
import './Inscription.css'

export default function Inscription() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    setError('')

    if (
      !formData.full_name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError('Tous les champs sont obligatoires')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      return
    }

    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères')
      return
    }

    try {
      setLoading(true)

      // Création du compte uniquement
      await registerUser({
        full_name: formData.full_name,
        email: formData.email,
        password: formData.password
      })

      // Après inscription → page connexion
      navigate('/connexion', { replace: true })

    } catch (err) {
      setError(
        err.message || 'Une erreur est survenue'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-page">

      <div className="auth-card">

        <div className="auth-header">
          <h1>Créer un compte</h1>
          <p>Rejoignez VoxStar</p>
        </div>

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label htmlFor="full_name">
              Nom complet
            </label>

            <input
              id="full_name"
              name="full_name"
              type="text"
              placeholder="Votre nom complet"
              value={formData.full_name}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">
              Adresse e-mail
            </label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="exemple@email.com"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              Mot de passe
            </label>

            <input
              id="password"
              name="password"
              type="password"
              placeholder="Votre mot de passe"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">
              Confirmer le mot de passe
            </label>

            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirmez votre mot de passe"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading
              ? 'Création du compte...'
              : "S'inscrire"}
          </button>

        </form>

        <p className="auth-footer">
          Vous avez déjà un compte ?{' '}

          <Link to="/connexion">
            Se connecter
          </Link>
        </p>

      </div>

    </main>
  )
}
