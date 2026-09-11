import { useEffect, useState } from 'react'
import './App.css'

const launchMessages = [
  'YOU ARE NOT SAVED BY YOUR WORKS.',
  'YOU ARE SAVED BY GOD’S GRACE.',
  'YOUR WORKS ARE MEANT SOLELY TO GLORIFY HIM.',
]

function App() {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setStep((current) => current + 1)
    }, 2500)

    return () => clearTimeout(timer)
  }, [step])

  const showingMessages = step < launchMessages.length
  const showingBrand = step >= launchMessages.length
  const showingNav = step > launchMessages.length

  return (
    <main className="app">
      <nav className={`main-nav ${showingNav ? 'is-visible' : ''}`}>
        <a href="#faith">Faith</a>
        <a href="#fitness">Fitness</a>
        <a href="#finance">Finance</a>
        <a href="#family">Family</a>
      </nav>

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

export default App