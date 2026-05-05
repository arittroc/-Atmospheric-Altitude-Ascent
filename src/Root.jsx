import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import App from './App'
import PermitsPage from './pages/PermitsPage'
import AcclimatisationPage from './pages/AcclimatisationPage'
import JournalPage from './pages/JournalPage'
import GearPage from './pages/GearPage'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function Root() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/"                element={<App />} />
        <Route path="/permits"         element={<PermitsPage />} />
        <Route path="/acclimatisation" element={<AcclimatisationPage />} />
        <Route path="/journal"         element={<JournalPage />} />
        <Route path="/gear"            element={<GearPage />} />
      </Routes>
    </BrowserRouter>
  )
}
