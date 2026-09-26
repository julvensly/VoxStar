import { useEffect, useState } from 'react'
import './Menu.css'

import PublicMenu from './PublicMenu'
import VoteurMenu from './VoteurMenu'
import CandidatMenu from './CandidatMenu'
import AdminMenu from './AdminMenu'

const API_URL = 'http://localhost:5000/api'

function Menu({ isOpen, onClose }) {
  const [menuType, setMenuType] = useState('public')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const loadMenu = async () => {
      setLoading(true)

      try {
        const token =
          localStorage.getItem('voxstar_token')

        /*
         * Pa gen connexion
         */
        if (!token) {
          setMenuType('public')
          return
        }

        /*
         * Nou voye JWT a bay backend
         */
        const response = await fetch(
          `${API_URL}/menu`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json'
            },
            cache: 'no-store'
          }
        )

        /*
         * Token pa valid oswa li ekspire
         */
        if (response.status === 401) {
          localStorage.removeItem(
            'voxstar_token'
          )

          localStorage.removeItem(
            'voxstar_user'
          )

          setMenuType('public')

          return
        }

        if (!response.ok) {
          throw new Error(
            `Erreur HTTP ${response.status}`
          )
        }

        const data = await response.json()

        if (!data.success) {
          throw new Error(
            data.message ||
            'Menu indisponible'
          )
        }

        /*
         * Backend lan detèmine menu an
         */
        const type = data.menu

        if (
          type === 'public' ||
          type === 'voteur' ||
          type === 'candidat' ||
          type === 'admin'
        ) {
          setMenuType(type)
        } else {
          setMenuType('public')
        }

        /*
         * Mete user backend lan verifye
         * nan localStorage tou.
         */
        if (data.user) {
          localStorage.setItem(
            'voxstar_user',
            JSON.stringify(data.user)
          )
        }

      } catch (error) {
        console.error(
          'Erreur chargement menu:',
          error
        )

        /*
         * Nou pa efase token nan si se
         * sèlman backend lan ki pa disponib.
         */
        setMenuType('public')

      } finally {
        setLoading(false)
      }
    }

    loadMenu()
  }, [isOpen])

  if (!isOpen) {
    return null
  }

  return (
    <>
      <div
        className="menu-overlay open"
        onClick={onClose}
      />

      {loading ? (
        <aside className="menu-panel open">

          <div className="menu-header">

            <img
              src="/Start.png"
              alt="VoxStar"
              className="menu-logo"
            />

            <button
              type="button"
              className="menu-close"
              onClick={onClose}
              aria-label="Fermer le menu"
            >
              ×
            </button>

          </div>

          <div className="menu-content">
            <p>Chargement...</p>
          </div>

        </aside>
      ) : (
        <>
          {menuType === 'public' && (
            <PublicMenu
              onClose={onClose}
            />
          )}

          {menuType === 'voteur' && (
            <VoteurMenu
              onClose={onClose}
            />
          )}

          {menuType === 'candidat' && (
            <CandidatMenu
              onClose={onClose}
            />
          )}

          {menuType === 'admin' && (
            <AdminMenu
              onClose={onClose}
            />
          )}
        </>
      )}
    </>
  )
}

export default Menu
