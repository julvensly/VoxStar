import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { getMe } from '../../../services/api'

import './Statut.css'

const API_URL = 'https://voxstar.onrender.com/api'

export default function Statut() {
  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const [showChangeForm, setShowChangeForm] =
    useState(false)

  const [code, setCode] = useState('')
  const [changing, setChanging] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await getMe()

        setUser(response.user)

        localStorage.setItem(
          'voxstar_user',
          JSON.stringify(response.user)
        )
      } catch (error) {
        console.error(
          'Erreur chargement statut:',
          error
        )

        localStorage.removeItem(
          'voxstar_token'
        )

        localStorage.removeItem(
          'voxstar_user'
        )

        navigate('/connexion', {
          replace: true
        })
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [navigate])

  const getStatus = (role) => {
    const normalizedRole =
      role?.toLowerCase()

    switch (normalizedRole) {
      case 'admin':
        return {
          label: 'Administrateur',
          icon: '🔵',
          description:
            'Vous avez accès aux fonctionnalités d’administration de VoxStar.',
          className: 'admin'
        }

      case 'candidat':
        return {
          label: 'Candidat',
          icon: '🟣',
          description:
            'Vous êtes inscrit comme candidat et pouvez participer aux concours autorisés.',
          className: 'candidat'
        }

      case 'voteur':
        return {
          label: 'Voteur',
          icon: '🟢',
          description:
            'Vous pouvez participer aux votes et utiliser les fonctionnalités disponibles aux voteurs.',
          className: 'voteur'
        }

      default:
        return {
          label: 'Voteur',
          icon: '🟢',
          description:
            'Votre compte utilise le statut Voteur par défaut.',
          className: 'voteur'
        }
    }
  }

  const handleChangeStatus = async (event) => {
    event.preventDefault()

    setError('')
    setSuccess('')

    const cleanCode = code.trim()

    if (!cleanCode) {
      setError(
        'Veuillez entrer votre code de statut.'
      )
      return
    }

    if (!/^[0-9]+$/.test(cleanCode)) {
      setError(
        'Le code de statut doit contenir uniquement des chiffres.'
      )
      return
    }

    try {
      setChanging(true)

      const token =
        localStorage.getItem('voxstar_token')

      if (!token) {
        navigate('/connexion', {
          replace: true
        })

        return
      }

      const response = await fetch(
        `${API_URL}/status/change`,
        {
          method: 'PUT',

          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            Accept: 'application/json'
          },

          body: JSON.stringify({
            code: cleanCode
          })
        }
      )

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
          'Impossible de modifier le statut.'
        )
      }

      setUser(data.user)

      localStorage.setItem(
        'voxstar_user',
        JSON.stringify(data.user)
      )

      setCode('')
      setSuccess(
        'Votre statut a été modifié avec succès.'
      )

      setShowChangeForm(false)

    } catch (error) {
      console.error(
        'Erreur changement statut:',
        error
      )

      setError(
        error.message ||
        'Une erreur est survenue.'
      )
    } finally {
      setChanging(false)
    }
  }

  const handleOpenChange = () => {
    setError('')
    setSuccess('')
    setCode('')
    setShowChangeForm(true)
  }

  const handleCancelChange = () => {
    setError('')
    setCode('')
    setShowChangeForm(false)
  }

  if (loading) {
    return (
      <main className="statut-page">
        <p className="information-loading">
          Chargement...
        </p>
      </main>
    )
  }

  if (!user) {
    return null
  }

  const status = getStatus(user.role)

  return (
    <main className="statut-page">

      <header className="sub-settings-header">

        <button
          type="button"
          onClick={() => navigate('/parametres')}
          className="sub-settings-back"
          aria-label="Retour"
        >
          ←
        </button>

        <h1>Statut</h1>

        <div className="sub-settings-space" />

       </header>

      <section className="statut-content">

        <div
          className={`current-status ${status.className}`}
        >

          <div className="status-icon">
            {status.icon}
          </div>

          <div className="status-information">

            <span>
              Votre statut
            </span>

            <strong>
              {status.label}
            </strong>

            <p>
              {status.description}
            </p>

          </div>

        </div>

        {success && (
          <div className="status-success">
            {success}
          </div>
        )}

        {!showChangeForm && (
          <button
            type="button"
            className="change-status-button"
            onClick={handleOpenChange}
          >
            Changer de statut
          </button>
        )}

        {showChangeForm && (
          <div className="change-status-box">

            <div className="change-status-header">
              <h2>
                Changer de statut
              </h2>

              <p>
                Entrez votre code de statut pour
                continuer.
              </p>
            </div>

            <form
              onSubmit={handleChangeStatus}
              className="change-status-form"
            >

              <label htmlFor="status-code">
                Code de statut
              </label>

              <input
                id="status-code"
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="Entrez votre code"
                value={code}
                onChange={(event) => {
                  setCode(
                    event.target.value
                  )
                  setError('')
                  setSuccess('')
                }}
                disabled={changing}
                autoComplete="off"
              />

              {error && (
                <div className="status-error">
                  {error}
                </div>
              )}

              <div className="change-status-actions">

                <button
                  type="button"
                  className="status-cancel-button"
                  onClick={handleCancelChange}
                  disabled={changing}
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  className="status-submit-button"
                  disabled={
                    changing ||
                    !code.trim()
                  }
                >
                  {changing
                    ? 'Vérification...'
                    : 'Valider'}
                </button>

              </div>

            </form>

          </div>
        )}

      </section>

    </main>
  )
}
