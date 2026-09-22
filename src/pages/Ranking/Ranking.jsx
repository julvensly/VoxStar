import { useNavigate } from 'react-router-dom'
import './Ranking.css'

function Ranking() {
  const navigate = useNavigate()

  const candidates = [
    {
      id: 1,
      name: 'Candidate 1',
      votes: 125
    },
    {
      id: 2,
      name: 'Candidate 2',
      votes: 110
    },
    {
      id: 3,
      name: 'Candidate 3',
      votes: 98
    },
    {
      id: 4,
      name: 'Candidate 4',
      votes: 87
    },
    {
      id: 5,
      name: 'Candidate 5',
      votes: 76
    }
  ]

  const sortedCandidates = [...candidates].sort(
    (a, b) => b.votes - a.votes
  )

  return (
    <main className="ranking">

      <div className="ranking-header">
        <p>VOXSTAR</p>
        <h1>Classement</h1>
        <span>Édition actuelle</span>
      </div>

      <div className="ranking-list">

        {sortedCandidates.map((candidate, index) => (

          <button
            key={candidate.id}
            className="ranking-card"
            onClick={() => navigate(`/#candidate-${candidate.id}`)}
          >

            <div className="ranking-position">
              #{index + 1}
            </div>

            <div className="ranking-info">

              <h2>
                {candidate.name}
              </h2>

            </div>

            <div className="ranking-votes">

              <strong>
                {candidate.votes}
              </strong>

              <span>
                votes
              </span>

            </div>

          </button>

        ))}

      </div>

    </main>
  )
}

export default Ranking
