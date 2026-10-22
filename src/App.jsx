import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.jsx'

import Inscrits from './pages/Inscrits/Inscrits.jsx'
import CreerConcours from './pages/Admin/CreerConcours/CreerConcours.jsx'
import GererConcours from './pages/Admin/GererConcours/GererConcours.jsx'
import GererCandidats from './pages/Admin/GererCandidats/GererCandidats.jsx'

import Navbar from './components/Navbar'
import Footer from './components/Footer'

import Home from './pages/Home'
import Ranking from './pages/Ranking/Ranking'
import Reglement from './pages/Reglement/Reglement'
import Contact from './pages/Contact/Contact'
import Candidat from './pages/Candidat/Candidat'
import Concours from './pages/Concours/Concours'
import MonCompte from './pages/MonCompte/MonCompte'
import Inscription from './pages/Inscription/Inscription'
import Connexion from './pages/Connexion/Connexion'
import Profile from './pages/Profile/Profile'

import Parametres from './pages/Parametres/Parametres'
import ModifierProfil from './pages/Parametres/ModifierProfil/ModifierProfil'
import Informations from './pages/Parametres/Informations/Informations'
import Statut from './pages/Parametres/Statut/Statut'
import MotDePasse from './pages/Parametres/MotDePasse/MotDePasse'

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <div className="app-content">
        <Routes>
          <Route path="/inscrits/:concoursId" element={<Inscrits />} />
          <Route path="/" element={<Home />} />
          <Route path="/classement" element={<Ranking />} />
          
          <Route path="/reglement" element={<Reglement />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/concours" element={<Concours />} /> 
          <Route path="/devenir-candidat" element={<Candidat />} />
          <Route path="/mon-compte" element={<MonCompte />} />
          <Route path="/inscription" element={<Inscription />} />
          <Route path="/connexion" element={<Connexion />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/parametres" element={<Parametres />} />
            <Route path="/parametres/profil" element={<ModifierProfil />} />
            <Route path="/parametres/informations" element={<Informations />} />
            <Route path="/parametres/statut" element={<Statut />} />
            <Route path="/parametres/mot-de-passe" element={<MotDePasse />} />
          </Route>

          <Route path="/admin/concours" element={<GererConcours />} />
          <Route path="/admin/concours/creer" element={<CreerConcours />} />
          <Route path="/admin/candidats" element={<GererCandidats />} />
        </Routes>
      </div>

      <Footer />
    </BrowserRouter>
  )
}

export default App
