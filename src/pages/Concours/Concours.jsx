import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Concours.css'

const API_URL = 'https://voxstar.onrender.com/api'
const SERVER_URL = 'https://voxstar.onrender.com'

function Concours() {
  const navigate = useNavigate()

  const [concours, setConcours] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadConcours = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await fetch(
          `${API_URL}/concours`
        )

        if (!response.ok) {
          throw new Error(
            'Erreur lors du chargement des concours'
          )
        }

        const data = await response.json()

        if (!data.success) {
          throw new Error(
            data.message ||
            'Impossible de charger les concours'
          )
        }

        setConcours(data.concours || [])
      } catch (error) {
        console.error('Concours error:', error)

        setError(
          error.message ||
          'Impossible de charger les concours'
        )
      } finally {
        setLoading(false)
      }
    }

    loadConcours()
  }, [])

  const formatDate = (date) => {
    if (!date) {
      return 'Non définie'
    }

    return new Date(date).toLocaleDateString(
      'fr-FR',
      {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }
    )
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case 'active':
        return 'En cours'

      case 'draft':
        return 'À venir'

      case 'finished':
        return 'Terminé'

      case 'cancelled':
        return 'Annulé'

      default:
        return status || 'Non défini'
    }
  }

  if (loading) {
    return (
      <main className="concours">
        <div className="concours-header">
          <p>VOXSTAR</p>

          <h1>Concours</h1>

          <span>
            Découvrez les concours disponibles
          </span>
        </div>

        <div className="concours-loading">
          Chargement des concours...
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="concours">
        <div className="concours-header">
          <p>VOXSTAR</p>

          <h1>Concours</h1>
        </div>

        <div className="concours-empty">
          <h2>Une erreur est survenue</h2>

          <p>{error}</p>

          <button
            type="button"
            onClick={() =>
              window.location.reload()
            }
          >
            Réessayer
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="concours">
      <div className="concours-header">
        <p>VOXSTAR</p>

        <h1>Concours</h1>

        <span>
          Découvrez les concours disponibles
        </span>
      </div>

      {concours.length === 0 ? (
        <div className="concours-empty">
          <div className="concours-empty-icon">
            🏆
          </div>

          <h2>Aucun concours</h2>

          <p>
            Aucun concours n'est disponible pour
            le moment.
          </p>
        </div>
      ) : (
        <div className="concours-list">
          {concours.map((item) => {
            const imageUrl = item.photo_url
              ? 
              item.photo_url.startsWith('http') 
              ?
              item.photo_url:
              `${SERVER_URL}${item.photo_url}`
              : null

            return (
              <article
                className="concours-card"
                key={item.id}
              >
                <div className="concours-flyer">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={`Affiche ${item.name}`}
                      className="concours-flyer-image"
                    />
                  ) : (
                    <div className="concours-flyer-placeholder">
                      <span>VOXSTAR</span>

                      <strong>
                        CONCOURS
                      </strong>
                    </div>
                  )}

                  <div className="concours-flyer-overlay">
                    <span className="concours-label">
                      VOXSTAR • CONCOURS
                    </span>

                    <h2>{item.name}</h2>
                  </div>

                  <span
                    className={`concours-status concours-status-${item.status}`}
                  >
                    {getStatusLabel(item.status)}
                  </span>
                </div>

                <div className="concours-card-content">
                  <div className="concours-info">
                    <div className="concours-info-item">
                      <span>Prix</span>

                      <strong>
                        {Number(
                          item.prix || 0
                        ).toLocaleString('fr-FR')}{' '}
                        HTG
                      </strong>
                    </div>

                    <div className="concours-info-item">
                      <span>Places</span>

                      <strong>
                        {item.places}
                      </strong>
                    </div>
                  </div>

                  <div className="concours-dates">
                    <div className="concours-date">
                      <span>Inscription</span>

                      <strong>
                        {formatDate(
                          item.inscription_debut
                        )}
                        {' → '}
                        {formatDate(
                          item.inscription_fin
                        )}
                      </strong>
                    </div>

                    <div className="concours-date">
                      <span>1er tour</span>

                      <strong>
                        {formatDate(
                          item.premier_debut
                        )}
                        {' → '}
                        {formatDate(
                          item.premier_fin
                        )}
                      </strong>
                    </div>

                    <div className="concours-date">
                      <span>2e tour</span>

                      <strong>
                        {formatDate(
                          item.deuxieme_debut
                        )}
                        {' → '}
                        {formatDate(
                          item.deuxieme_fin
                        )}
                      </strong>
                    </div>

                    <div className="concours-date">
                      <span>3e tour</span>

                      <strong>
                        {formatDate(
                          item.troisieme_debut
                        )}
                        {' → '}
                        {formatDate(
                          item.troisieme_fin
                        )}
                      </strong>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="concours-inscrire-button"
                    onClick={() =>
                      navigate(
                        `/inscrits/${item.id}`
                      )
                    }
                  >
                    INSKRI
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </main>
  )
}

export default Concours
