import { useEffect, useState } from 'react'
import { voteCandidate } from '../../services/api.js'
import './TopCandidates.css'

const API_URL = 'https://voxstar.onrender.com'

function TopCandidates() {

  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadTopCandidates = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await fetch(
          `${API_URL}/api/ranking/top`
        )

        if (!response.ok) {
          throw new Error(
            'Erreur lors du chargement des candidats'
          )
        }

        const data = await response.json()

        if (!data.success) {
          throw new Error(
            data.message ||
            'Impossible de charger les candidats'
          )
        }

        setCandidates(data.candidates || [])
      } catch (error) {
        console.error(
          'Top candidates error:',
          error
        )

        setError(
          error.message ||
          'Impossible de charger les candidats'
        )
      } finally {
        setLoading(false)
      }
    }

    loadTopCandidates()
  }, [])

  const handleVote = async (candidateId) => {
    try {
      const result = await voteCandidate(candidateId)

      setCandidates((currentCandidates) =>
        currentCandidates.map((candidate) =>
          candidate.id === candidateId
            ? { ...candidate, total_votes: result.vote.total_votes }
            : candidate
        )
      )

      window.alert(result.message || "Vote enregistré avec succès")
    } catch (error) {
      console.error("Vote error:", error)
      window.alert(error.message || "Erreur lors du vote")
    }
  }

  if (loading) {
    return (
      <section className="top-candidates">
        <div className="top-candidates-header">
          <p>VOXSTAR</p>
          <h2>Top 3 Candidates</h2>
        </div>

        <div className="top-candidates-slider">
          <div className="candidate-card">
            <div className="candidate-photo">
              <span>...</span>
            </div>

            <div className="candidate-info">
              <h3>Chargement...</h3>
              <p>Chargement des votes...</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="top-candidates">
        <div className="top-candidates-header">
          <p>VOXSTAR</p>
          <h2>Top 3 Candidates</h2>
        </div>

        <div className="top-candidates-slider">
          <div className="candidate-card">
            <div className="candidate-photo">
              <span>!</span>
            </div>

            <div className="candidate-info">
              <h3>Erreur</h3>
              <p>{error}</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (candidates.length === 0) {
    return (
      <section className="top-candidates">
        <div className="top-candidates-header">
          <p>VOXSTAR</p>
          <h2>Top 3 Candidates</h2>
        </div>

        <div className="top-candidates-slider">
          <div className="candidate-card">
            <div className="candidate-photo">
              <span>—</span>
            </div>

            <div className="candidate-info">
              <h3>Aucun candidat</h3>

              <p>
                Aucune édition active pour le moment.
              </p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="top-candidates">
      <div className="top-candidates-header">
        <p>VOXSTAR</p>
        <h2>Top 3 Candidates</h2>
      </div>

      <div className="top-candidates-slider">
        {candidates.map((candidate, index) => (
          <div
            className="candidate-card"
            key={candidate.id}
          >
            <div className="candidate-photo">
              <span>#{index + 1}</span>

              {candidate.photo_url && (
                <img
                  src={`${API_URL}${candidate.photo_url}`}
                  alt={candidate.full_name}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              )}
            </div>

            <div className="candidate-info">
              <h3>
                {candidate.full_name}
              </h3>

              <p>
                {candidate.concours_name
                  ? `${candidate.concours_name} • `
                  : ''}
                {candidate.total_votes} votes
              </p>

              <button
                type="button"
                onClick={() =>
                  handleVote(candidate.id)
                }
              >
                Vote
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default TopCandidates
