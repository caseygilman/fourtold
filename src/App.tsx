import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'

import Navigation from './components/Navigation'

import Today from './pages/Today'
import Faith from './pages/Faith'
import Fitness from './pages/Fitness'
import Finance from './pages/Finance'
import Family from './pages/Family'

import './App.css'

const launchMessages = [
  'YOU ARE NOT SAVED BY YOUR WORKS.',
  'YOU ARE SAVED BY GOD’S GRACE.',
  'YOUR WORKS ARE MEANT SOLELY TO GLORIFY HIM.',
]

function Home() {
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (step >= launchMessages.length) return

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
        <div
          className={`brand-logo ${
            showingBrand ? 'is-visible' : ''
          }`}
        >
          <span className="brand-letter">FOUR</span>
          <span className="brand-cross">†</span>
          <span className="brand-letter">OLD</span>
        </div>

        <p
          className={`hero-tagline ${
            showingBrand ? 'is-visible' : ''
          }`}
        >
          Live faithfully today in light of what is to come.
        </p>
      </div>

      {showingMessages && (
        <p
          key={step}
          className="launch-message"
        >
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
        <Route path="/fitness" element={<Fitness />} />
        <Route path="/finance" element={<Finance />} />
        <Route path="/family" element={<Family />} />
      </Routes>

      <Navigation />
    </>
  )
}

export default App