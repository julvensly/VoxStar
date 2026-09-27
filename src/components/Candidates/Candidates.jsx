import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Candidates.css'

const API_URL = 'https://voxstar.onrender.com'

function Candidates() {
  const navigate = useNavigate()

  const [candidates, setCandidates] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadCandidates = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await fetch(
          `${API_URL}/api/candidates`
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
          'Candidates error:',
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

    loadCandidates()
  }, [])

  const filteredCandidates = candidates.filter(
    (candidate) => {
      const name =
        candidate.full_name?.toLowerCase() || ''

      const className =
        candidate.class_name?.toLowerCase() || ''

      const searchValue =
        search.trim().toLowerCase()

      return (
        name.includes(searchValue) ||
        className.includes(searchValue)
      )
    }
  )

  const handleVote = (candidateId) => {
    navigate(`/vote/${candidateId}`)
  }

  if (loading) {
    return (
      <section className="candidates">
        <div className="candidates-header">
          <p>VOXSTAR</p>
          <h2>Nos candidats</h2>
        </div>

        <div className="candidates-search">
          <input
            type="search"
            placeholder="Rechercher un candidat..."
            disabled
          />
        </div>

        <div className="candidates-slider">
          <div className="candidate-card">
            <div className="candidate-photo">
              <span>...</span>
            </div>

            <div className="candidate-info">
              <h3>Chargement...</h3>
              <p>Chargement des candidats...</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="candidates">
        <div className="candidates-header">
          <p>VOXSTAR</p>
          <h2>Nos candidats</h2>
        </div>

        <div className="candidate-card">
          <div className="candidate-info">
            <h3>Erreur</h3>
            <p>{error}</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="candidates">
      <div className="candidates-header">
        <p>VOXSTAR</p>
        <h2>Nos candidats</h2>
      </div>

      <div className="candidates-search">
        <input
          type="search"
          placeholder="Rechercher un candidat..."
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
        />
      </div>

      {filteredCandidates.length === 0 ? (
        <div className="candidate-card">
          <div className="candidate-info">
            <h3>Aucun candidat</h3>

            <p>
              Aucun candidat ne correspond à
              votre recherche.
            </p>
          </div>
        </div>
      ) : (
        <div className="candidates-slider">
          {filteredCandidates.map(
            (candidate, index) => (
              <div
                className="candidate-card"
                key={candidate.id}
              >
                <div className="candidate-photo">
                  <span>
                    #{index + 1}
                  </span>

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
                    {candidate.total_votes} votes
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      handleVote(candidate.id)
                    }
                  >
                    Voter
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </section>
  )
}

export default Candidates
