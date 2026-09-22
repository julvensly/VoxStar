import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Navbar from './components/Navbar'
import Footer from './components/Footer'

import Home from './pages/Home'
import Ranking from './pages/Ranking/Ranking'
import Reglement from './pages/Reglement/Reglement'
import Contact from './pages/Contact/Contact'
import Candidat from './pages/Candidat/Candidat'

function App() {
  return (
    <BrowserRouter>

      <Navbar />

      <div className="app-content">

        <Routes>

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/classement"
            element={<Ranking />}
          />

          <Route
            path="/reglement"
            element={<Reglement />}
          />

          <Route
            path="/contact"
            element={<Contact />}
          />

          <Route
            path="/devenir-candidat"
            element={<Candidat />}
          />

        </Routes>

      </div>

      <Footer />

    </BrowserRouter>
  )
}

export default App
