import { useState } from 'react'
import './CreerConcours.css'

function CreerConcours() {
  const [form, setForm] = useState({
    nom: '',
    prix: '',
    places: '',
    inscriptionDebut: '',
    inscriptionFin: '',
    premierDebut: '',
    premierFin: '',
    premierNombre: '',
    deuxiemeDebut: '',
    deuxiemeFin: '',
    deuxiemeNombre: '',
    troisiemeDebut: '',
    troisiemeFin: ''
  })

  const [affiche, setAffiche] = useState(null)
  const [apercu, setApercu] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target

    setForm((previous) => ({
      ...previous,
      [name]: value
    }))
  }

  const handleImage = (event) => {
    const file = event.target.files?.[0]

    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner une image valide.')
      event.target.value = ''
      return
    }

    setAffiche(file)
    setApercu(URL.createObjectURL(file))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (
      new Date(form.inscriptionFin) <=
      new Date(form.inscriptionDebut)
    ) {
      alert('La date de fin des inscriptions doit être après la date de début.')
      return
    }

    if (
      new Date(form.premierFin) <=
      new Date(form.premierDebut)
    ) {
      alert('Vérifiez les dates du premier tour.')
      return
    }

    if (
      new Date(form.deuxiemeFin) <=
      new Date(form.deuxiemeDebut)
    ) {
      alert('Vérifiez les dates du deuxième tour.')
      return
    }

    if (
      new Date(form.troisiemeFin) <=
      new Date(form.troisiemeDebut)
    ) {
      alert('Vérifiez les dates du troisième tour.')
      return
    }

    if (!affiche) {
      alert("Veuillez sélectionner l'affiche du concours.")
      return
    }

    try {
      const token = localStorage.getItem('voxstar_token')

      if (!token) {
        alert('Vous devez être connecté.')
        return
      }

      const data = new FormData()

      data.append('nom', form.nom)
      data.append('prix', form.prix)
      data.append('places', form.places)

      data.append('inscriptionDebut', form.inscriptionDebut)
      data.append('inscriptionFin', form.inscriptionFin)

      data.append('premierDebut', form.premierDebut)
      data.append('premierFin', form.premierFin)
      data.append('premierNombre', form.premierNombre)

      data.append('deuxiemeDebut', form.deuxiemeDebut)
      data.append('deuxiemeFin', form.deuxiemeFin)
      data.append('deuxiemeNombre', form.deuxiemeNombre)

      data.append('troisiemeDebut', form.troisiemeDebut)
      data.append('troisiemeFin', form.troisiemeFin)

      data.append('affiche', affiche)

      const response = await fetch(
        'https://voxstar.onrender.com/api/concours',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: data
        }
      )

      const result = await response.json()

      if (!response.ok) {
        alert(result.message || 'Erreur lors de la création du concours.')
        return
      }

      console.log('Concours créé:', result.concours)

      alert('Concours créé avec succès.')

      setForm({
        nom: '',
        prix: '',
        places: '',
        inscriptionDebut: '',
        inscriptionFin: '',
        premierDebut: '',
        premierFin: '',
        premierNombre: '',
        deuxiemeDebut: '',
        deuxiemeFin: '',
        deuxiemeNombre: '',
        troisiemeDebut: '',
        troisiemeFin: ''
      })

      URL.revokeObjectURL(apercu)
      setAffiche(null)
      setApercu('')
    } catch (error) {
      console.error('Erreur création concours:', error)

      alert('Impossible de contacter le serveur.')
    }
  }

  return (
    <main className="create-contest-page">
      <div className="create-contest-container">

        <header className="create-contest-heading">
          <span className="create-contest-eyebrow">
            ESPACE ADMINISTRATEUR
          </span>

          <h1>Créer un concours</h1>

          <p>
            Configurez les informations, les inscriptions
            et les différentes étapes du concours VoxStar.
          </p>
        </header>

        <form
          className="contest-form"
          onSubmit={handleSubmit}
        >

          <section className="contest-section">
            <div className="contest-section-title">
              <span className="contest-step">01</span>
              <div>
                <h2>Informations générales</h2>
                <p>Présentez le concours et ses conditions.</p>
              </div>
            </div>

            <div className="contest-field">
              <label htmlFor="nom">Nom du concours</label>
              <input
                id="nom"
                name="nom"
                type="text"
                value={form.nom}
                onChange={handleChange}
                placeholder="Ex. VoxStar Vertières"
                required
              />
            </div>

            <div className="contest-field">
              <label htmlFor="affiche">
                Photo d'affichage du concours
              </label>

              <label
                className="contest-image-upload"
                htmlFor="affiche"
              >
                {apercu ? (
                  <img
                    src={apercu}
                    alt="Aperçu de l'affiche du concours"
                    className="contest-image-preview"
                  />
                ) : (
                  <span className="contest-image-placeholder">
                    <span className="contest-image-icon">＋</span>
                    <strong>Ajouter une affiche</strong>
                    <small>
                      Sélectionnez une image dans votre galerie
                    </small>
                    <small>JPG, PNG ou WEBP</small>
                  </span>
                )}
              </label>

              <input
                id="affiche"
                className="contest-file-input"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleImage}
              />

              {affiche && (
                <div className="contest-image-info">
                  <span>{affiche.name}</span>
                  <button
                    type="button"
                    className="contest-remove-image"
                    onClick={() => {
                      URL.revokeObjectURL(apercu)
                      setAffiche(null)
                      setApercu('')
                    }}
                  >
                    Retirer l'image
                  </button>
                </div>
              )}
            </div>

            <div className="contest-fields-grid">
              <div className="contest-field">
                <label htmlFor="prix">
                  Prix de participation (HTG)
                </label>
                <input
                  id="prix"
                  name="prix"
                  type="number"
                  min="0"
                  step="1"
                  value={form.prix}
                  onChange={handleChange}
                  placeholder="Ex. 1000"
                  required
                />
              </div>

              <div className="contest-field">
                <label htmlFor="places">
                  Nombre de places disponibles
                </label>
                <input
                  id="places"
                  name="places"
                  type="number"
                  min="1"
                  step="1"
                  value={form.places}
                 onChange={handleChange}
                  placeholder="Ex. 100"
                  required
                />
              </div>
            </div>
          </section>

          <section className="contest-section">
            <div className="contest-section-title">
              <span className="contest-step">02</span>
              <div>
                <h2>Période d'inscription</h2>
                <p>Définissez la période pendant laquelle les candidats pourront s'inscrire.</p>
              </div>
            </div>

            <div className="contest-fields-grid">
              <div className="contest-field">
                <label htmlFor="inscriptionDebut">
                  Début des inscriptions
                </label>
<input
                  id="inscriptionDebut"
                  name="inscriptionDebut"
                  type="datetime-local"
                  value={form.inscriptionDebut}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="contest-field">
                <label htmlFor="inscriptionFin">
                  Fin des inscriptions
                </label>
                <input
                  id="inscriptionFin"
                  name="inscriptionFin"
                  type="datetime-local"
                  value={form.inscriptionFin}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </section>

          <section className="contest-section">
<div className="contest-section-title">
              <span className="contest-step">03</span>
              <div>
                <h2>Premier tour</h2>
                <p>Configurez les dates et le nombre de candidats retenus.</p>
              </div>
            </div>

            <div className="contest-fields-grid">
              <div className="contest-field">
                <label htmlFor="premierDebut">Date de début</label>
                <input
                  id="premierDebut"
                  name="premierDebut"
                  type="datetime-local"
                  value={form.premierDebut}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="contest-field">
                <label htmlFor="premierFin">Date de fin</label>
                <input
                  id="premierFin"
                  name="premierFin"
                  type="datetime-local"
value={form.premierFin}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="contest-field">
              <label htmlFor="premierNombre">
                Nombre de candidats retenus pour le premier tour
              </label>
              <input
                id="premierNombre"
                name="premierNombre"
                type="number"
                min="1"
                step="1"
                value={form.premierNombre}
                onChange={handleChange}
                placeholder="Nombre de candidats"
                required
              />
            </div>
          </section>

          <section className="contest-section">
            <div className="contest-section-title">
              <span className="contest-step">04</span>
              <div>
<h2>Deuxième tour</h2>
                <p>Définissez la période et le nombre de candidats qui continueront.</p>
              </div>
            </div>

            <div className="contest-fields-grid">
              <div className="contest-field">
                <label htmlFor="deuxiemeDebut">Date de début</label>
                <input
                  id="deuxiemeDebut"
                  name="deuxiemeDebut"
                  type="datetime-local"
                  value={form.deuxiemeDebut}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="contest-field">
                <label htmlFor="deuxiemeFin">Date de fin</label>
                <input
                  id="deuxiemeFin"
                  name="deuxiemeFin"
                  type="datetime-local"
                  value={form.deuxiemeFin}
                  onChange={handleChange}
required
                />
              </div>
            </div>

            <div className="contest-field">
              <label htmlFor="deuxiemeNombre">
                Nombre de candidats retenus pour le deuxième tour
              </label>
              <input
                id="deuxiemeNombre"
                name="deuxiemeNombre"
                type="number"
                min="1"
                step="1"
                value={form.deuxiemeNombre}
                onChange={handleChange}
                placeholder="Nombre de candidats"
                required
              />
            </div>
          </section>

          <section className="contest-section">
            <div className="contest-section-title">
              <span className="contest-step">05</span>
              <div>
                <h2>Troisième tour</h2>
                <p>Définissez la dernière étape du concours.</p>
              </div>
            </div>
<div className="contest-fields-grid">
              <div className="contest-field">
                <label htmlFor="troisiemeDebut">Date de début</label>
                <input
                  id="troisiemeDebut"
                  name="troisiemeDebut"
                  type="datetime-local"
                  value={form.troisiemeDebut}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="contest-field">
                <label htmlFor="troisiemeFin">Date de fin</label>
                <input
                  id="troisiemeFin"
                  name="troisiemeFin"
                  type="datetime-local"
                  value={form.troisiemeFin}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

<div className="contest-rule-note">
              <strong>Règle du troisième tour</strong>
              <p>
                Le nombre de candidats participant au troisième
                tour sera égal au nombre de candidats inscrits,
                selon la règle définie pour ce concours.
              </p>
            </div>
          </section>

          <div className="contest-form-actions">
            <button
              type="submit"
              className="contest-submit"
            >
              Créer le concours
            </button>

            <p>
              Le formulaire sera connecté au backend
              dans la prochaine étape.
            </p>
          </div>

        </form>
      </div>
    </main>
  )
}

export default CreerConcours
