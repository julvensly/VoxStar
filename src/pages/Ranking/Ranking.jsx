import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Ranking.css'

const API_URL = 'http://localhost:5000/api'

function Ranking() {
  const navigate = useNavigate()

  const [candidates, setCandidates] = useState([])
  const [edition, setEdition] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadRanking = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await fetch(`${API_URL}/ranking`)

        if (!response.ok) {
          throw new Error('Erreur lors du chargement du classement')
        }

        const data = await response.json()

        if (!data.success) {
          throw new Error(
            data.message || 'Impossible de charger le classement'
          )
        }

        setEdition(data.edition)
        setCandidates(data.candidates || [])
      } catch (error) {
        console.error('Ranking error:', error)

        setError(
          error.message ||
          'Impossible de charger le classement'
        )
      } finally {
        setLoading(false)
      }
    }

    loadRanking()
  }, [])

  const handleCandidateClick = (candidateId) => {
    navigate(`/#candidate-${candidateId}`)
  }

  if (loading) {
    return (
      <main className="ranking">
        <div className="ranking-header">
          <p>VOXSTAR</p>
          <h1>Classement</h1>
          <span>Édition actuelle</span>
        </div>

        <div className="ranking-loading">
          Chargement du classement...
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="ranking">
        <div className="ranking-header">
          <p>VOXSTAR</p>
          <h1>Classement</h1>
          <span>Édition actuelle</span>
        </div>

        <div className="ranking-empty">
          <p>{error}</p>

          <button
            type="button"
            onClick={() => window.location.reload()}
          >
            Réessayer
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="ranking">
      <div className="ranking-header">
        <p>VOXSTAR</p>

        <h1>Classement</h1>

        <span>
          {edition?.title || 'Édition actuelle'}
        </span>
      </div>

      {candidates.length === 0 ? (
        <div className="ranking-empty">
          <h2>Aucun candidat</h2>

          <p>
            Il n'y a actuellement aucun candidat
            dans l'édition active.
          </p>
        </div>
      ) : (
        <div className="ranking-list">
          {candidates.map((candidate, index) => (
            <button
              key={candidate.id}
              type="button"
              className="ranking-card"
              onClick={() =>
                handleCandidateClick(candidate.id)
              }
            >
              <div className="ranking-position">
                #{index + 1}
              </div>

              {candidate.photo_url ? (
                <img
                  src={`http://localhost:5000${candidate.photo_url}`}
                  alt={candidate.full_name}
                  className="ranking-photo"
                />
              ) : (
                <div className="ranking-photo-placeholder">
                  👤
                </div>
              )}

              <div className="ranking-info">
                <h2>{candidate.full_name}</h2>

                <span>
                  {candidate.class_name || 'Classe non définie'}
                </span>
              </div>

              <div className="ranking-votes">
                <strong>
                  {candidate.total_votes}
                </strong>

                <span>votes</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </main>
  )
}

export default Ranking
