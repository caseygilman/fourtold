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

  if (step < launchMessages.length) {
    return (
      <main className="launch-screen">
        <p key={step} className="launch-message">
          {launchMessages[step]}
        </p>
      </main>
    )
  }

  if (step === launchMessages.length) {
    return (
      <main className="launch-screen">
        <div key={step} className="launch-brand">
          <h1>FOUR†OLD</h1>
          <p>Live today in light of what is to come.</p>
        </div>
      </main>
    )
  }

  return (
    <main className="app">
      <h1>FOUR†OLD</h1>
      <p>Faith · Fitness · Finance · Family</p>
      <p>Live faithfully today in light of what is to come.</p>
    </main>
  )
}

export default App