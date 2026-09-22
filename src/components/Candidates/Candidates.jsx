import './Candidates.css'

function Candidates() {
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
        />
      </div>

      <div className="candidates-slider">

        <div className="candidate-card">

          <div className="candidate-photo">
            <span>#1</span>
          </div>

          <div className="candidate-info">

            <h3>Candidate 1</h3>

            <p>
              0 votes
            </p>

            <button>
              Voter
            </button>

          </div>

        </div>

        <div className="candidate-card">

          <div className="candidate-photo">
            <span>#2</span>
          </div>

          <div className="candidate-info">

            <h3>Candidate 2</h3>

            <p>
              0 votes
            </p>

            <button>
              Voter
            </button>

          </div>

        </div>

        <div className="candidate-card">

          <div className="candidate-photo">
            <span>#3</span>
          </div>

          <div className="candidate-info">

            <h3>Candidate 3</h3>

            <p>
              0 votes
            </p>

            <button>
              Voter
            </button>

          </div>

        </div>

      </div>

    </section>
  )
}

export default Candidates
