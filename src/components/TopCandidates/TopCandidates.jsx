import './TopCandidates.css'

function TopCandidates() {
  return (
    <section className="top-candidates">

      <div className="top-candidates-header">
        <p>VOXSTAR</p>
        <h2>Top 3 Candidates</h2>
      </div>

      <div className="top-candidates-slider">

        <div className="candidate-card">
          <div className="candidate-photo">
            <span>#1</span>
          </div>

          <div className="candidate-info">
            <h3>Candidate 1</h3>
            <p>0 votes</p>

            <button>
              Vote
            </button>
          </div>
        </div>

        <div className="candidate-card">
          <div className="candidate-photo">
            <span>#2</span>
          </div>

          <div className="candidate-info">
            <h3>Candidate 2</h3>
            <p>0 votes</p>

            <button>
              Vote
            </button>
          </div>
        </div>

        <div className="candidate-card">
          <div className="candidate-photo">
            <span>#3</span>
          </div>

          <div className="candidate-info">
            <h3>Candidate 3</h3>
            <p>0 votes</p>

            <button>
              Vote
            </button>
          </div>
        </div>

      </div>

    </section>
  )
}

export default TopCandidates
