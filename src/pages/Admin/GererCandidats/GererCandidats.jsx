import { useEffect, useMemo, useState } from 'react'
import './GererCandidats.css'

const API_URL = 'https://voxstar.onrender.com'

function GererCandidats() {
  const [candidates, setCandidates] = useState([])
  const [search, setSearch] = useState('')
  const [concoursFilter, setConcoursFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState(null)
  const [message, setMessage] = useState('')

  async function loadCandidates() {
    try {
      setLoading(true)
      setError('')

      const response = await fetch(`${API_URL}/api/candidates`)
      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || 'Impossible de charger les candidats.'
        )
      }

      setCandidates(data.candidates || [])
    } catch (err) {
      console.error('Erreur chargement candidats:', err)
      setError(err.message || 'Erreur lors du chargement des candidats.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCandidates()
  }, [])

  async function handleDelete(candidate) {
    const confirmed = window.confirm(
      `Voulez-vous vraiment supprimer ${candidate.full_name || `le candidat #${candidate.id}`} ?\n\nAttention : les votes associés à ce candidat seront également supprimés.`
    )

    if (!confirmed) return

    const token = localStorage.getItem('voxstar_token')

    if (!token) {
      setError('Vous devez vous connecter pour effectuer cette action.')
      return
    }

    try {
      setDeletingId(candidate.id)
      setError('')
      setMessage('')

      const response = await fetch(
        `${API_URL}/api/candidates/${candidate.id}`,
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
          data.message || 'Impossible de supprimer ce candidat.'
        )
      }

      setCandidates((previous) =>
        previous.filter((item) => item.id !== candidate.id)
      )

      setMessage(
        `${candidate.full_name || `Le candidat #${candidate.id}`} a été supprimé avec succès.`
      )
    } catch (err) {
      console.error('Erreur suppression candidat:', err)
      setError(err.message || 'Erreur lors de la suppression du candidat.')
    } finally {
      setDeletingId(null)
    }
  }

  const concoursList = useMemo(() => {
    const concours = new Map()

    candidates.forEach((candidate) => {
      concours.set(
        String(candidate.concours_id),
        candidate.concours_name || 'Concours sans nom'
      )
    })

    return Array.from(concours, ([id, name]) => ({ id, name }))
  }, [candidates])

  const filteredCandidates = useMemo(() => {
    const searchValue = search.trim().toLowerCase()

    return candidates.filter((candidate) => {
      const name = candidate.full_name?.toLowerCase() || ''
      const concours = candidate.concours_name?.toLowerCase() || ''

      const matchesSearch =
        name.includes(searchValue) ||
        concours.includes(searchValue) ||
        String(candidate.id).includes(searchValue)

      const matchesConcours =
        concoursFilter === 'all' ||
        String(candidate.concours_id) === concoursFilter

      return matchesSearch && matchesConcours
    })
  }, [candidates, search, concoursFilter])

  const totalVotes = candidates.reduce(
    (total, candidate) => total + Number(candidate.total_votes || 0),
    0
  )

  if (loading) {
    return (
      <main className="admin-candidates-page">
        <div className="admin-candidates-message">
          Chargement des candidats...
        </div>
      </main>
    )
  }

  return (
    <main className="admin-candidates-page">
      <header className="admin-candidates-header">
        <div>
          <span className="admin-candidates-eyebrow">
            ESPACE ADMINISTRATEUR
          </span>

          <h1>Gérer les candidats</h1>

          <p>
            Consultez les candidats inscrits et suivez leurs votes.
          </p>
        </div>

        <button
          type="button"
          className="admin-candidates-refresh"
          onClick={loadCandidates}
          disabled={deletingId !== null}
        >
          ↻ Actualiser
        </button>
      </header>

      <section className="admin-candidates-stats">
        <article className="admin-candidates-stat">
          <span>Total candidats</span>
          <strong>{candidates.length}</strong>
        </article>

        <article className="admin-candidates-stat">
          <span>Total des votes</span>
          <strong>{totalVotes}</strong>
        </article>

        <article className="admin-candidates-stat">
         <span>Concours concernés</span>
          <strong>{concoursList.length}</strong>
        </article>
      </section>

      <section className="admin-candidates-list">
        <div className="admin-candidates-list-header">
          <h2>Liste des candidats</h2>
          <span>{filteredCandidates.length} résultat(s)</span>
        </div>

        {message && (
          <div className="admin-candidates-success" role="status">
            {message}
          </div>
        )}

        {error && (
          <div className="admin-candidates-error" role="alert">
            <p>{error}</p>
            <button type="button" onClick={loadCandidates}>
              Réessayer
            </button>
          </div>
        )}

        <div className="admin-candidates-filters">
          <input
            type="search"
            placeholder="Rechercher un nom ou un identifiant..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Rechercher un candidat"
          />

          <select
            value={concoursFilter}
            onChange={(event) => setConcoursFilter(event.target.value)}
            aria-label="Filtrer par concours"
          >
            <option value="all">Tous les concours</option>

            {concoursList.map((concours) => (
              <option key={concours.id} value={concours.id}>
                {concours.name}
              </option>
            ))}
          </select>
        </div>

        {filteredCandidates.length === 0 && (
          <div className="admin-candidates-empty">
            Aucun candidat trouvé.
          </div>
        )}

        {filteredCandidates.length > 0 && (
          <div className="admin-candidates-grid">
            {filteredCandidates.map((candidate) => (
              <article
                className="admin-candidate-card"
                key={candidate.id}
              >
                <div className="admin-candidate-photos">
                  <div className="admin-candidate-main-photo">
                    {candidate.photo_url ? (
                      <img
                        src={`${API_URL}${candidate.photo_url}`}
                        alt={`Photo de ${candidate.full_name}`}
                        loading="lazy"
                      />
                    ) : (
                      <span>📷</span>
                    )}
                  </div>

                  <div className="admin-candidate-profile-photo">
                    {candidate.profil_url ? (
                      <img
                        src={`${API_URL}${candidate.profil_url}`}
                        alt={`Profil de ${candidate.full_name}`}
                        loading="lazy"
                      />
                    ) : (
                      <span>👤</span>
                    )}
                  </div>
                </div>

                <div className="admin-candidate-details">
                  <span className="admin-candidate-id">
                    Candidat #{candidate.id}
                  </span>

                  <h3>{candidate.full_name || 'Nom indisponible'}</h3>

                  <p>
                    <strong>Concours :</strong>{' '}
                    {candidate.concours_name || 'Non renseigné'}
                  </p>

                  <p>
                    <strong>ID utilisateur :</strong>{' '}
                    {candidate.user_id}
                  </p>

                  <div className="admin-candidate-votes">
                    🗳️ {Number(candidate.total_votes || 0)} vote(s)
                  </div>

                  <button
                    type="button"
                    className="admin-candidate-delete"
                    onClick={() => handleDelete(candidate)}
                    disabled={deletingId !== null}
                  >
                    {deletingId === candidate.id
                      ? 'Suppression...'
                      : 'Supprimer'}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default GererCandidats
