import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './GererConcours.css'

const API_URL = 'https://voxstar.onrender.com/api'
const SERVER_URL = 'https://voxstar.onrender.com'

function GererConcours() {
  const navigate = useNavigate()

  const [concours, setConcours] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [deletingId, setDeletingId] = useState(null)
  const [activatingId, setActivatingId] = useState(null)

  const loadConcours = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await fetch(`${API_URL}/concours`)
      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || 'Impossible de charger les concours'
        )
      }

      setConcours(data.concours || [])
    } catch (err) {
      console.error('Gerer concours error:', err)
      setError(err.message || 'Impossible de charger les concours')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadConcours()
  }, [])

  const handleActivate = async (item) => {
    const confirmed = window.confirm(
      `Voulez-vous activer le concours « ${item.name} » ?`
    )

    if (confirmed === false) return

    const token = localStorage.getItem("voxstar_token")

    if (!token) {
      setMessage("Vous devez vous connecter en tant qu’administrateur.")
      return
    }

    try {
      setActivatingId(item.id)
      setMessage("")

      const response = await fetch(
        `${API_URL}/concours/${item.id}/activate`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Impossible d’activer ce concours")
      }

      setConcours((previous) =>
        previous.map((concoursItem) =>
          concoursItem.id === item.id
            ? { ...concoursItem, ...data.concours }
            : concoursItem
        )
      )

      setMessage(data.message || `Le concours « ${item.name} » a été activé.`)
    } catch (err) {
      console.error("Activate concours error:", err)
      setMessage(err.message || "Erreur lors de l’activation du concours")
    } finally {
      setActivatingId(null)
    }
  }

  const handleDelete = async (item) => {
    const confirmed = window.confirm(
      `ATTENTION : voulez-vous vraiment supprimer le concours « ${item.name} » ?\n\n` +
      'Cette action est définitive. Les candidats inscrits à ce concours et les votes associés seront également supprimés.\n\n' +
      'Cliquez sur OK pour confirmer.'
    )

    if (!confirmed) return

    const token = localStorage.getItem('voxstar_token')

    if (!token) {
      setMessage('Vous devez vous connecter en tant qu’administrateur.')
      return
    }

    try {
      setDeletingId(item.id)
      setMessage('')

      const response = await fetch(
        `${API_URL}/concours/${item.id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || 'Impossible de supprimer ce concours'
        )
      }

      setConcours((previous) =>
        previous.filter((concoursItem) => concoursItem.id !== item.id)
      )

      setMessage(`Le concours « ${item.name} » a été supprimé avec succès.`)
    } catch (err) {
      console.error('Delete concours error:', err)
      setMessage(err.message || 'Erreur lors de la suppression du concours')
    } finally {
      setDeletingId(null)
    }
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

  const formatDate = (date) => {
    if (!date) return 'Non définie'

    const parsedDate = new Date(date)

    if (Number.isNaN(parsedDate.getTime())) {
      return 'Non définie'
    }

    return parsedDate.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <main className="gerer-concours">
        <div className="gerer-concours-header">
          <p>VOXSTAR</p>
          <h1>Gérer les concours</h1>
          <span>Chargement des concours...</span>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="gerer-concours">
        <div className="gerer-concours-header">
          <p>VOXSTAR</p>
          <h1>Gérer les concours</h1>
        </div>

        <div className="gerer-concours-message">
          <h2>Une erreur est survenue</h2>
          <p>{error}</p>

          <button type="button" onClick={loadConcours}>
            Réessayer
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="gerer-concours">
      <div className="gerer-concours-header">
        <p>VOXSTAR • ADMIN</p>
        <h1>Gérer les concours</h1>
        <span>Consultez et gérez les concours VoxStar</span>
      </div>

      <div className="gerer-concours-actions">
        <button
          type="button"
          onClick={() => navigate('/admin/concours/creer')}
        >
          + Créer un concours
        </button>
      </div>

      {message && (
        <div
          className={`gerer-concours-feedback ${
            message.toLowerCase().includes('succès')
              ? 'gerer-concours-feedback-success'
              : 'gerer-concours-feedback-error'
          }`}
          role="status"
        >
          {message}
        </div>
      )}

      {concours.length === 0 ? (
        <div className="gerer-concours-message">
          <div className="gerer-concours-icon">🏆</div>
          <h2>Aucun concours</h2>
          <p>Aucun concours n'a encore été créé.</p>

          <button
            type="button"
            onClick={() => navigate('/admin/concours/creer')}
          >
            Créer le premier concours
          </button>
        </div>
      ) : (
        <div className="gerer-concours-list">
          {concours.map((item) => {
            const imageUrl = item.photo_url
              ? item.photo_url.startsWith('http')
                ? item.photo_url
                : `${SERVER_URL}${item.photo_url}`
              : null

            return (
              <article className="gerer-concours-card" key={item.id}>
                <div className="gerer-concours-image">
                  {imageUrl ? (
                    <img src={imageUrl} alt={`Affiche ${item.name}`} />
                  ) : (
                    <div className="gerer-concours-placeholder">
                      VOXSTAR
                    </div>
                  )}

                  <span
                    className={`gerer-concours-status gerer-concours-status-${item.status}`}
                  >
                    {getStatusLabel(item.status)}
                  </span>
                </div>

                <div className="gerer-concours-content">
                  <h2>{item.name}</h2>

                  <div className="gerer-concours-info">
                    <div>
                      <span>Prix</span>
                      <strong>
                        {Number(item.prix || 0).toLocaleString('fr-FR')} HTG
                      </strong>
                    </div>

                    <div>
                      <span>Places</span>
                      <strong>{item.places}</strong>
                    </div>
                  </div>

                  <div className="gerer-concours-date">
                    <span>Inscription</span>
                    <strong>
                      {formatDate(item.inscription_debut)}
                      {' → '}
                      {formatDate(item.inscription_fin)}
                    </strong>
                  </div>

                  <button
                    type="button"
                    className="gerer-concours-button"
                    onClick={() => navigate(`/admin/concours/${item.id}`)}
                  >
                    Gérer ce concours
                  </button>

                  {item.status === "draft" && (
                    <button
                      type="button"
                      className="gerer-concours-activate"
                      onClick={() => handleActivate(item)}
                      disabled={activatingId !== null || deletingId !== null}
                    >
                      {activatingId === item.id
                        ? "Activation en cours..."
                        : "Activer le concours"}
                    </button>
                  )}

                  <button
                    type="button"
                    className="gerer-concours-delete"
                    onClick={() => handleDelete(item)}
                    disabled={deletingId !== null || activatingId !== null}
                  >
                    {deletingId === item.id
                      ? "Suppression en cours..."
                      : "Supprimer le concours"}
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

export default GererConcours
