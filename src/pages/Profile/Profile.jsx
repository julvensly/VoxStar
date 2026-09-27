import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMe } from '../../services/api'
import './Profile.css'

const API_URL = 'https://voxstar.onrender.com'

export default function Profile() {
  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await getMe()

        setUser(response.user)

        localStorage.setItem(
          'voxstar_user',
          JSON.stringify(response.user)
        )
      } catch (error) {
        localStorage.removeItem('voxstar_token')
        localStorage.removeItem('voxstar_user')

        navigate('/connexion', { replace: true })
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [navigate])

  if (loading) {
    return (
      <main className="profile-page">
        <div className="profile-loading">
          Chargement...
        </div>
      </main>
    )
  }

  if (!user) {
    return null
  }

  const photoUrl = user.photo_url
    ? `${API_URL}${user.photo_url}`
    : ''

  return (
    <main className="profile-page">
      <section className="profile-header">
        <div className="profile-top">

          <div className="profile-avatar-wrapper">
            {photoUrl ? (
              <img
                src={photoUrl}
                alt={`Photo de ${user.full_name}`}
                style={{
                  width: '105px',
                  height: '105px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
            ) : (
              <div className="profile-avatar-placeholder">
                👤
              </div>
            )}
          </div>

          <button
            type="button"
            className="profile-settings-button"
            onClick={() => navigate('/parametres')}
            aria-label="Paramètres"
          >
            ⚙️
          </button>

        </div>

        <div className="profile-name">
          {user.full_name}
        </div>
      </section>

      <section className="profile-content">
        <div className="profile-stat">
          <strong>0</strong>
          <span>Votes</span>
        </div>

        <div className="profile-stat">
          <strong>0</strong>
          <span>Concours</span>
        </div>

        <div className="profile-stat">
          <strong>0</strong>
          <span>Gagnants</span>
        </div>
      </section>
    </main>
  )
}
