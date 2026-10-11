import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Ranking.css'

const API_URL = 'https://voxstar.onrender.com/api'

const ROUNDS = [
  { number: 1, label: 'Premye tou' },
  { number: 2, label: 'Dezyèm tou' },
  { number: 3, label: 'Twazyèm tou · Final' },
]

function Ranking() {
  const navigate = useNavigate()

  const [candidates, setCandidates] = useState([])
  const [edition, setEdition] = useState(null)
  const [round, setRound] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    const loadRanking = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await fetch(
          `${API_URL}/ranking?round=${round}`,
          { signal: controller.signal }
        )

        const data = await response.json()

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || 'Impossible de charger le classement'
          )
        }

        setEdition(data.edition)
        setCandidates(data.candidates || [])
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Ranking error:', err)
          setError(
            err.message || 'Impossible de charger le classement'
          )
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadRanking()

    return () => controller.abort()
  }, [round])

  const handleCandidateClick = (candidateId) => {
    navigate(`/#candidate-${candidateId}`)
  }

  const selectedRound = ROUNDS.find(
    (item) => item.number === round
  )

  return (
    <main className="ranking">
      <div className="ranking-header">
        <p>VOXSTAR</p>
        <h1>Classement</h1>
        <span>{edition?.title || edition?.name || 'Concours actuel'}</span>
      </div>

      <nav className="ranking-rounds" aria-label="Phases du classement">
        {ROUNDS.map((item) => (
          <button
            key={item.number}
            type="button"
            className={`ranking-round ${
              round === item.number ? 'active' : ''
            }`}
            aria-pressed={round === item.number}
            onClick={() => setRound(item.number)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="ranking-round-title">
        <h2>{selectedRound?.label}</h2>
        <p>
          {round === 1 &&
            'Classement des candidats de la première manche.'}
          {round === 2 &&
            'Classement des candidats qualifiés pour la deuxième manche.'}
          {round === 3 &&
            'Classement des finalistes du concours.'}
        </p>
      </div>

      {loading ? (
        <div className="ranking-loading">
          Chargement du classement...
        </div>
      ) : error ? (
        <div className="ranking-empty">
          <p>{error}</p>
          <button
            type="button"
            onClick={() => setRound((current) => current)}
          >
            Réessayer
          </button>
        </div>
      ) : candidates.length === 0 ? (
        <div className="ranking-empty">
          <h2>Aucun candidat pour cette phase</h2>
          <p>
            Le classement apparaîtra lorsque les candidats de cette
            phase seront disponibles.
          </p>
        </div>
      ) : (
        <div className="ranking-list">
          {candidates.map((candidate, index) => (
            <button
              key={candidate.id}
              type="button"
              className="ranking-card"
              onClick={() => handleCandidateClick(candidate.id)}
            >
              <div className="ranking-position">
                #{index + 1}
              </div>

              <div className="ranking-info">
                <h2>{candidate.full_name}</h2>
                <span>
                  {candidate.concours_name || 'Concours'}
                </span>
              </div>

              <div className="ranking-votes">
                <strong>{candidate.total_votes ?? 0}</strong>
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
