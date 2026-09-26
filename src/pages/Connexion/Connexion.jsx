import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser } from '../../services/api'
import './Connexion.css'

export default function Connexion() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: '',
    password: ''
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

    if (!formData.email || !formData.password) {
      setError('Email et mot de passe sont obligatoires')
      return
    }

    try {
      setLoading(true)

      const response = await loginUser({
        email: formData.email,
        password: formData.password
      })

      localStorage.setItem(
        'voxstar_token',
        response.token
      )

      localStorage.setItem(
        'voxstar_user',
        JSON.stringify(response.user)
      )

      // Remplace la page connexion dans l'historique
      navigate('/profile', { replace: true })

    } catch (err) {
      setError(
        err.message || 'Email ou mot de passe incorrect'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-page">

      <div className="auth-card">

        <div className="auth-header">
          <h1>Se connecter</h1>
          <p>Connectez-vous à votre compte VoxStar</p>
        </div>

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

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
              autoComplete="email"
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
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>

        </form>

        <p className="auth-footer">
          Vous n'avez pas encore de compte ?{' '}

          <Link to="/inscription">
            S'inscrire
          </Link>
        </p>

      </div>

    </main>
  )
}
