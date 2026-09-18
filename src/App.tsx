import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import Faith from './pages/Faith'
import Today from './pages/Today'
import './App.css'

const launchMessages = [
  'YOU ARE NOT SAVED BY YOUR WORKS.',
  'YOU ARE SAVED BY GOD’S GRACE.',
  'YOUR WORKS ARE MEANT SOLELY TO GLORIFY HIM.',
]

function Home() {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setStep((current) => current + 1)
    }, 2500)

    return () => clearTimeout(timer)
  }, [step])

  const showingMessages = step < launchMessages.length
  const showingBrand = step >= launchMessages.length

  return (
    <main className="app">

      <div className="hero">
        <div className={`brand-logo ${showingBrand ? 'is-visible' : ''}`}>
          <span className="brand-letter">FOUR</span>
          <span className="brand-cross">†</span>
          <span className="brand-letter">OLD</span>
        </div>

        <p className={`hero-tagline ${showingBrand ? 'is-visible' : ''}`}>
          Live faithfully today in light of what is to come.
        </p>
      </div>

      {showingMessages && (
        <p key={step} className="launch-message">
          {launchMessages[step]}
        </p>
      )}
    </main>
  )
}

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/today" element={<Today />} />
        <Route path="/faith" element={<Faith />} />
      </Routes>

      <Navigation />
    </>
  )
}

export default App