import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  getMe,
  updateProfileName,
  updateProfilePhoto
} from '../../../services/api'

import './ModifierProfil.css'

export default function ModifierProfil() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  const [user, setUser] = useState(null)

  const [oldName, setOldName] = useState('')
  const [newName, setNewName] = useState('')

  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const [photoPreview, setPhotoPreview] = useState('')

  const [loadingProfile, setLoadingProfile] = useState(true)
  const [savingName, setSavingName] = useState(false)
  const [savingPhoto, setSavingPhoto] = useState(false)

  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  // ==============================
  // CHARGER LE PROFIL
  // ==============================

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await getMe()

        setUser(response.user)
        setOldName(response.user.full_name)
      } catch (error) {
        localStorage.removeItem('voxstar_token')
        localStorage.removeItem('voxstar_user')

        navigate('/connexion', {
          replace: true
        })
      } finally {
        setLoadingProfile(false)
      }
    }

    loadProfile()
  }, [navigate])

  // ==============================
  // NETTOYER LE PREVIEW
  // ==============================

  useEffect(() => {
    return () => {
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview)
      }
    }
  }, [photoPreview])

  // ==============================
  // CHOISIR UNE PHOTO
  // ==============================

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    setMessage('')
    setError('')

    if (!file.type.startsWith('image/')) {
      setError('Veuillez sélectionner une image.')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('La photo ne doit pas dépasser 5 Mo.')
      return
    }

    if (photoPreview) {
      URL.revokeObjectURL(photoPreview)
    }

    setSelectedPhoto(file)

    const previewUrl = URL.createObjectURL(file)

    setPhotoPreview(previewUrl)
  }

  // ==============================
  // ENREGISTRER LA PHOTO
  // ==============================

  const handleSavePhoto = async () => {
    if (!selectedPhoto) {
      return
    }

    setMessage('')
    setError('')

    try {
      setSavingPhoto(true)

      const response = await updateProfilePhoto(selectedPhoto)

      setUser(response.user)

      const savedUser = JSON.parse(
        localStorage.getItem('voxstar_user') || '{}'
      )

      localStorage.setItem(
        'voxstar_user',
        JSON.stringify({
          ...savedUser,
          photo_url: response.user.photo_url
        })
      )

      setMessage(response.message)

      setSelectedPhoto(null)

      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }

      if (photoPreview) {
        URL.revokeObjectURL(photoPreview)
      }

      setPhotoPreview('')
    } catch (error) {
      setError(error.message)
    } finally {
      setSavingPhoto(false)
    }
  }

  // ==============================
  // MODIFIER LE NOM
  // ==============================

  const handleSubmitName = async (event) => {
    event.preventDefault()

    setMessage('')
    setError('')

    if (!oldName.trim() || !newName.trim()) {
      setError(
        'Veuillez remplir l’ancien nom et le nouveau nom.'
      )
      return
    }

    try {
      setSavingName(true)

      const response = await updateProfileName({
        old_full_name: oldName,
        new_full_name: newName
      })

      setUser(response.user)

      const savedUser = JSON.parse(
        localStorage.getItem('voxstar_user') || '{}'
      )

      localStorage.setItem(
        'voxstar_user',
        JSON.stringify({
          ...savedUser,
          full_name: response.user.full_name
        })
      )

      setOldName(response.user.full_name)
      setNewName('')

      setMessage(response.message)
    } catch (error) {
      setError(error.message)
    } finally {
      setSavingName(false)
    }
  }

  // ==============================
  // CHARGEMENT
  // ==============================

  if (loadingProfile) {
    return (
      <main className="modifier-profil-page">
        <div className="profile-loading">
          Chargement...
        </div>
      </main>
    )
  }

  if (!user) {
    return null
  }

  // ==============================
  // PHOTO À AFFICHER
  // ==============================

  const getPhotoUrl = () => {
    if (photoPreview) {
      return photoPreview
    }

    if (user.photo_url) {
      return `http://localhost:5000${user.photo_url}`
    }

    return ''
  }

  const photoUrl = getPhotoUrl()

  // ==============================
  // PAGE
  // ==============================

  return (
    <main className="modifier-profil-page">

      <header className="sub-settings-header">

        <button
          type="button"
          onClick={() => navigate('/parametres')}
          className="sub-settings-back"
          aria-label="Retour"
        >
          ←
        </button>

        <h1>
          Modifier le profil
        </h1>

        <div className="sub-settings-space" />

      </header>

      <section className="modifier-profil-content">

        {/* ==========================
            PHOTO
        ========================== */}

        <div className="profile-photo-section">

          <div className="change-photo-circle">

            {photoUrl ? (
              <img
                src={photoUrl}
                alt="Photo de profil"
                className="profile-photo-preview"
              />
            ) : (
              <span className="profile-photo-placeholder">
                👤
              </span>
            )}

          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="photo-input"
          />

          <button
            type="button"
            className="change-photo-button"
            onClick={() =>
              fileInputRef.current?.click()
            }
          >
            Modifier la photo
          </button>

          {selectedPhoto && (
            <button
              type="button"
              className="save-photo-button"
              onClick={handleSavePhoto}
              disabled={savingPhoto}
            >
              {savingPhoto
                ? 'Enregistrement...'
                : 'Enregistrer la photo'}
            </button>
          )}

        </div>

        {/* ==========================
            FORMULAIRE NOM
        ========================== */}

        <form
          onSubmit={handleSubmitName}
          className="modifier-profil-form"
        >

          <div className="form-group">

            <label htmlFor="old_full_name">
              Ancien nom
            </label>

            <input
              id="old_full_name"
              type="text"
              value={oldName}
              onChange={(event) =>
                setOldName(event.target.value)
              }
              placeholder="Votre nom actuel"
              autoComplete="name"
            />

          </div>

          <div className="form-group">

            <label htmlFor="new_full_name">
              Nouveau nom
            </label>

            <input
              id="new_full_name"
              type="text"
              value={newName}
              onChange={(event) =>
                setNewName(event.target.value)
              }
              placeholder="Votre nouveau nom"
              autoComplete="name"
            />

          </div>

          {error && (
            <p className="profile-message error">
              {error}
            </p>
          )}

          {message && (
            <p className="profile-message success">
              {message}
            </p>
          )}

          <button
            type="submit"
            className="save-profile-button"
            disabled={savingName}
          >
            {savingName
              ? 'Enregistrement...'
              : 'Enregistrer le nom'}
          </button>

        </form>

      </section>

    </main>
  )
}
