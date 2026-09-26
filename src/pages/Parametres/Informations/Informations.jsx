import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMe } from '../../../services/api'
import './Informations.css'

export default function Informations() {
  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await getMe()

        setUser(response.user)
      } catch (error) {
        localStorage.removeItem('voxstar_token')
        localStorage.removeItem('voxstar_user')

        navigate('/connexion', {
          replace: true
        })
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [navigate])

  if (loading) {
    return (
      <main className="informations-page">
        <p className="information-loading">
          Chargement...
        </p>
      </main>
    )
  }

  if (!user) {
    return null
  }

  const getStatusLabel = (role) => {
    const roles = {
      user: 'Voteur',
      voter: 'Voteur',
      candidate: 'Candidat',
      admin: 'Administrateur',
      administrator: 'Administrateur'
    }

    return roles[role?.toLowerCase()] || role || 'Voteur'
  }

  return (
    <main className="informations-page">

      <header className="sub-settings-header">

        <button
          type="button"
          onClick={() => navigate('/parametres')}
          className="sub-settings-back"
          aria-label="Retour"
        >
          ←
        </button>

        <h1>Mes informations</h1>

        <div className="sub-settings-space" />

      </header>

      <section className="information-content">

        <div className="information-row">
          <span>Nom complet</span>
          <strong>{user.full_name}</strong>
        </div>

        <div className="information-row">
          <span>Adresse e-mail</span>
          <strong>{user.email}</strong>
        </div>

        <div className="information-row">
          <span>Mot de passe</span>
          <strong>••••••••</strong>
        </div>

        <div className="information-row">
          <span>Statut</span>
          <strong>{getStatusLabel(user.role)}</strong>
        </div>

        <button
          type="button"
          className="change-password-button"
          onClick={() => navigate('/parametres/mot-de-passe')}
        >
          Modifier le mot de passe
        </button>

      </section>

    </main>
  )
}
