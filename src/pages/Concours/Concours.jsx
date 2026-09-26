import { useEffect, useState } from 'react'
import './Concours.css'

const API_URL = 'http://localhost:5000/api'

function Concours() {
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
        console.error(
          'Concours error:',
          error
        )

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
          {concours.map((item) => (
            <article
              className="concours-card"
              key={item.id}
            >
              <div className="concours-card-top">
                <div>
                  <span className="concours-label">
                    CONCOURS
                  </span>

                  <h2>{item.title}</h2>
                </div>

                <span
                  className={`concours-status concours-status-${item.status}`}
                >
                  {getStatusLabel(item.status)}
                </span>
              </div>

              <div className="concours-dates">
                <div className="concours-date">
                  <span>Inscription</span>

                  <strong>
                    {formatDate(
                      item.registration_start
                    )}
                    {' → '}
                    {formatDate(
                      item.registration_end
                    )}
                  </strong>
                </div>

                <div className="concours-date">
                  <span>Vote</span>

                  <strong>
                    {formatDate(
                      item.voting_start
                    )}
                    {' → '}
                    {formatDate(
                      item.voting_end
                    )}
                  </strong>
                </div>

                <div className="concours-date">
                  <span>Résultats</span>

                  <strong>
                    {formatDate(
                      item.results_date
                    )}
                  </strong>
                </div>
              </div>
            </article>
          ))}
       </div>
      )}
    </main>
  )
}

export default Concours
