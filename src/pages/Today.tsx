import { useEffect, useState } from 'react'
import type { Cross, Pillar } from '../types/Cross'

type DailyProgress = {
  [crossId: string]: boolean
}

const CROSS_STORAGE_KEY = 'fourtold-crosses'

const pillarOrder: Pillar[] = [
  'faith',
  'fitness',
  'finance',
  'family',
]

const pillarNames: Record<Pillar, string> = {
  faith: 'FAITH',
  fitness: 'FITNESS',
  finance: 'FINANCE',
  family: 'FAMILY',
}

function getTodayKey() {
  const today = new Date()

  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function loadCrosses(): Cross[] {
  const savedCrosses = localStorage.getItem(CROSS_STORAGE_KEY)

  if (!savedCrosses) return []

  try {
    return JSON.parse(savedCrosses)
  } catch {
    return []
  }
}

function Today() {
  const [crosses] = useState<Cross[]>(loadCrosses)

  const todayKey = getTodayKey()
  const storageKey = `fourtold-walk-${todayKey}`

  const [progress, setProgress] = useState<DailyProgress>(() => {
    const savedProgress = localStorage.getItem(storageKey)

    if (!savedProgress) return {}

    try {
      return JSON.parse(savedProgress)
    } catch {
      return {}
    }
  })

  useEffect(() => {
    localStorage.setItem(
      storageKey,
      JSON.stringify(progress)
    )
  }, [progress, storageKey])

  function toggleCross(id: string) {
    setProgress((current) => ({
      ...current,
      [id]: !current[id],
    }))
  }

  const completedCount = crosses.filter(
    (cross) => progress[cross.id]
  ).length

  const allComplete =
    crosses.length > 0 &&
    completedCount === crosses.length

  return (
    <main className="pillar-page">
      <p className="pillar-label">FOUR†OLD</p>

      <h1>TODAY'S WALK</h1>

      <p>
        Carry faithfully what has been entrusted to you today.
      </p>

      <section className="todays-crosses">
        <h2>Your Crosses Today</h2>

        {crosses.length === 0 ? (
          <p>
            You haven't chosen any Crosses yet.
          </p>
        ) : (
          <>
            <p>
              {completedCount} of {crosses.length} carried
            </p>

            {pillarOrder.map((pillar) => {
              const pillarCrosses = crosses.filter(
                (cross) => cross.pillar === pillar
              )

              if (pillarCrosses.length === 0) return null

              return (
                <section
                  key={pillar}
                  className={`walk-pillar walk-${pillar}`}
                >
                  <h3>{pillarNames[pillar]}</h3>

                  <ul>
                    {pillarCrosses.map((cross) => {
                      const isComplete = Boolean(
                        progress[cross.id]
                      )

                      return (
                        <li key={cross.id}>
                          <label>
                            <input
                              type="checkbox"
                              checked={isComplete}
                              onChange={() =>
                                toggleCross(cross.id)
                              }
                            />

                            <span>
                              {cross.name}
                            </span>
                          </label>
                        </li>
                      )
                    })}
                  </ul>
                </section>
              )
            })}

            {allComplete && (
              <div className="walk-complete">
                <p>Today's Walk is complete.</p>

                <p>
                  You will know by your fruit.
                </p>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  )
}

export default Today