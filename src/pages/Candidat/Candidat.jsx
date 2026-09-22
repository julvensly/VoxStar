import { useState } from 'react'
import './Candidat.css'

function Candidat() {
  const [openSection, setOpenSection] = useState(null)

  const toggleSection = (id) => {
    setOpenSection(openSection === id ? null : id)
  }

  const sections = [
    {
      id: 1,
      title: 'Qu’est-ce qu’un compte candidat ?',
      content: (
        <p>
          Un compte candidat est un compte qui possède
          l’autorisation de participer aux compétitions VOXSTAR.
          Cette autorisation est délivrée uniquement par
          l’administration de VOXSTAR.
        </p>
      )
    },

    {
      id: 2,
      title: 'Qui peut avoir un compte candidat ?',
      content: (
        <p>
          Pour avoir un compte candidat, vous devez être âgé
          de <strong>18 ans ou plus</strong>. Les personnes de
          moins de 18 ans ne peuvent pas obtenir un compte candidat.
        </p>
      )
    },

    {
      id: 3,
      title: 'Qui délivre l’autorisation ?',
      content: (
        <p>
          L’autorisation de participer aux compétitions est
          délivrée <strong>uniquement par l’administration</strong>
          de VOXSTAR. La création d’un compte ne donne pas
          automatiquement le statut de candidat.
        </p>
      )
    },

    {
      id: 4,
      title: 'Comment demander un compte candidat ?',
      content: (
        <p>
          Pour demander un compte candidat, vous devez contacter
          l’administration de VOXSTAR. Votre demande sera examinée
          par l’administration avant que l’autorisation soit délivrée.
        </p>
      )
    },

    {
      id: 5,
      title: 'Contacter l’administration',
      content: (
        <p>
          Pour demander votre compte candidat, contactez
          l’administration de VOXSTAR sur WhatsApp au :
          <br />
          <strong>+509 33 86 09 48</strong>
        </p>
      )
    }
  ]

  return (
    <main className="candidat">

      <div className="candidat-header">
        <p>VOXSTAR</p>
        <h1>Comment devenir candidat ?</h1>
        <span>Compte candidat et autorisation</span>
      </div>

      <div className="candidat-list">

        {sections.map((section) => (
          <section
            key={section.id}
            className={`candidat-item ${
              openSection === section.id ? 'open' : ''
            }`}
          >

            <button
              type="button"
              className="candidat-button"
              onClick={() => toggleSection(section.id)}
              aria-expanded={openSection === section.id}
            >
              <span>
                {section.id}. {section.title}
              </span>

              <span className="candidat-arrow">
                {openSection === section.id ? '⌃' : '⌄'}
              </span>
            </button>

            {openSection === section.id && (
              <div className="candidat-content">
                {section.content}
              </div>
            )}

          </section>
        ))}

      </div>

    </main>
  )
}

export default Candidat
