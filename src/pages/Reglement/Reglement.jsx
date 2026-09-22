import { useState } from 'react'
import './Reglement.css'

function Reglement() {
  const [openRule, setOpenRule] = useState(null)

  const toggleRule = (id) => {
    setOpenRule(openRule === id ? null : id)
  }

  const rules = [
    {
      id: 1,
      title: 'Qui peut participer ?',
      content: (
        <p>
          La participation à un concours VOXSTAR est réservée
          exclusivement aux personnes âgées de <strong>18 ans ou plus</strong>.
          Toute personne âgée de moins de 18 ans ne peut pas participer
          comme candidat.
        </p>
      )
    },

    {
      id: 2,
      title: 'Quand s’inscrire ?',
      content: (
        <p>
          Toute personne souhaitant participer doit s’inscrire uniquement
          pendant la période d’inscription officiellement annoncée pour
          l’édition concernée. Les inscriptions effectuées en dehors de
          cette période ne sont pas prises en compte.
        </p>
      )
    },

    {
      id: 3,
      title: 'Frais de participation',
      content: (
        <p>
          L’inscription est soumise au paiement d’un frais de participation.
          Le montant est communiqué par l’administration avant l’ouverture
          des inscriptions de chaque édition.
        </p>
      )
    },

    {
      id: 4,
      title: 'Éditions spéciales',
      content: (
        <p>
          Les concours VOXSTAR sont organisés à l’occasion d’événements
          ou de périodes particulières, notamment les fêtes de Noël,
          la fête de l’Indépendance ou d’autres occasions annoncées
          officiellement. Les concours ne sont pas organisés selon
          une fréquence mensuelle fixe.
        </p>
      )
    },

    {
      id: 5,
      title: 'Comment voter ?',
      content: (
        <p>
          Les votes sont effectués conformément au système de vote
          officiellement mis à disposition par VOXSTAR pendant la
          période de vote annoncée pour l’édition concernée.
        </p>
      )
    },

    {
      id: 6,
      title: 'Comment gagne-t-on ?',
      content: (
        <p>
          À la clôture des votes, le candidat qui obtient le plus grand
          nombre de votes valides est déclaré gagnant de l’édition.
        </p>
      )
    },

    {
      id: 7,
      title: 'Votes frauduleux',
      content: (
        <p>
          Il est interdit de manipuler les résultats au moyen de votes
          frauduleux, de moyens automatisés, de faux comptes ou de toute
          autre méthode destinée à fausser le classement. Les votes
          identifiés comme frauduleux peuvent être annulés.
        </p>
      )
    },

    {
      id: 8,
      title: 'Classement',
      content: (
        <p>
          Le classement des candidats est établi selon le nombre de
          votes valides obtenus pendant la période officielle de vote.
          En cas d’égalité, la procédure de départage annoncée pour
          l’édition concernée sera appliquée.
        </p>
      )
    },

    {
      id: 9,
      title: 'Prix et récompense',
      content: (
        <p>
          Le prix ou la récompense destiné au gagnant est communiqué
          par l’administration avant ou pendant l’édition concernée.
          Les conditions de remise peuvent être précisées dans
          l’annonce officielle.
        </p>
      )
    },

    {
      id: 10,
      title: 'Rôle de l’administration',
      content: (
        <p>
          L’administration de VOXSTAR assure l’organisation générale
          des concours, la validation des candidatures, la publication
          des informations officielles et la supervision du processus
          de vote.
        </p>
      )
    },

    {
      id: 11,
      title: 'Modification ou annulation',
      content: (
        <p>
          VOXSTAR peut modifier, reporter ou annuler une édition lorsque
          des circonstances particulières l’exigent. Toute modification
          importante est communiquée aux participants et au public par
          les canaux officiels de VOXSTAR.
        </p>
      )
    },

    {
      id: 12,
      title: 'Acceptation du règlement',
      content: (
        <p>
          La participation à un concours VOXSTAR implique l’acceptation
          du présent règlement ainsi que des conditions particulières
          annoncées pour l’édition concernée.
        </p>
      )
    }
  ]

  return (
    <main className="reglement">

      <div className="reglement-header">
        <p>VOXSTAR</p>
        <h1>Règlement</h1>
        <span>Les règles du concours</span>
      </div>

      <div className="reglement-list">

        {rules.map((rule) => (
          <section
            key={rule.id}
            className={`reglement-item ${
              openRule === rule.id ? 'open' : ''
            }`}
          >

            <button
              type="button"
              className="reglement-button"
              onClick={() => toggleRule(rule.id)}
              aria-expanded={openRule === rule.id}
            >
              <span>
                {rule.id}. {rule.title}
              </span>

              <span className="reglement-arrow">
                {openRule === rule.id ? '⌃' : '⌄'}
              </span>
            </button>

            {openRule === rule.id && (
              <div className="reglement-content">
                {rule.content}
              </div>
            )}

          </section>
        ))}

      </div>

    </main>
  )
}

export default Reglement
