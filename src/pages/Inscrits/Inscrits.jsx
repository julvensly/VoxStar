import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import './Inscrits.css'

const API_URL = 'https://voxstar.onrender.com/api'
const SERVER_URL = 'https://voxstar.onrender.com'

function Inscrits() {
  const { concoursId } = useParams()

  const [concours, setConcours] = useState(null)
  const [photo, setPhoto] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const loadConcours = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await fetch(
          `${API_URL}/concours/${concoursId}`
        )

        const data = await response.json()

        if (!response.ok || !data.success) {
          throw new Error(
            data.message ||
            'Impossible de charger le concours'
          )
        }

        setConcours(data.concours)
      } catch (error) {
        console.error(
          'Inscrits concours error:',
          error
        )

        setError(
          error.message ||
          'Une erreur est survenue'
        )
      } finally {
        setLoading(false)
      }
    }

    if (concoursId) {
      loadConcours()
    }
  }, [concoursId])

  const handlePhotoChange = (event) => {
    const selectedFile =
      event.target.files?.[0] || null

    setPhoto(selectedFile)
    setError('')
    setMessage('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    setError('')
    setMessage('')

    if (!photo) {
      setError(
        'Veuillez sélectionner une photo pour votre inscription.'
      )
      return
    }

    const token =
      localStorage.getItem('voxstar_token')

    if (!token) {
      setError(
        'Vous devez être connecté pour vous inscrire à un concours.'
      )
      return
    }

    try {
      setSubmitting(true)

      const formData = new FormData()
      formData.append('photo', photo)

      const response = await fetch(
        `${API_URL}/inscrits/${concoursId}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: formData
        }
      )

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
          'Impossible de terminer l’inscription'
        )
      }

      setMessage(
        data.message ||
        'Inscription réussie.'
      )

      setPhoto(null)

      const photoInput =
        document.getElementById('photo')

      if (photoInput) {
        photoInput.value = ''
      }
    } catch (error) {
      console.error(
        'Inscription candidat error:',
        error
      )

      setError(
        error.message ||
        'Une erreur est survenue pendant l’inscription.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <main className="inscrits">
        <p className="inscrits-message">
          Chargement...
        </p>
      </main>
    )
  }

  if (error && !concours) {
    return (
      <main className="inscrits">
        <p className="inscrits-message inscrits-error">
          {error}
        </p>
      </main>
    )
  }

  if (!concours) {
    return (
      <main className="inscrits">
        <p className="inscrits-message">
          Concours introuvable.
        </p>
      </main>
    )
  }

  const imageUrl = concours.photo_url
    ? `${SERVER_URL}${concours.photo_url}`
    : null

  return (
    <main className="inscrits">
      <section className="inscrits-container">

        <div className="inscrits-header">
          <h1>Inscription</h1>

          <p>
            Inscrivez-vous à ce concours
          </p>
        </div>

        <div className="inscrits-concours">

          <div className="inscrits-image">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={concours.name}
              />
            ) : (
              <div className="inscrits-image-placeholder">
                VOXSTAR
              </div>
            )}
          </div>

          <div className="inscrits-info">

            <h2>{concours.name}</h2>

            <div className="inscrits-price">
              <span>
                Prix d'inscription
              </span>

              <strong>
                {Number(
                  concours.prix || 0
                ).toLocaleString('fr-FR')}{' '}
                HTG
              </strong>
            </div>

            <div className="inscrits-places">
              <span>
                Places disponibles
              </span>

              <strong>
                {concours.places}
              </strong>
            </div>

          </div>
        </div>

        {error && (
          <p className="inscrits-message inscrits-error">
            {error}
          </p>
        )}

        {message && (
          <p className="inscrits-message">
            {message}
          </p>
        )}

        <form
          className="inscrits-form"
          onSubmit={handleSubmit}
        >

          <div className="inscrits-form-group">

            <label htmlFor="photo">
              Photo du candidat
            </label>

            <input
              id="photo"
              name="photo"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              disabled={submitting}
            />

            <small>
              Cette photo sera utilisée pour votre
              participation au concours.
            </small>

          </div>

          <button
            type="submit"
            className="inscrits-submit"
            disabled={submitting}
          >
            {submitting
              ? 'Inscription en cours...'
              : 'Confirmer mon inscription'}
          </button>

        </form>

      </section>
    </main>
  )
}

export default Inscrits
