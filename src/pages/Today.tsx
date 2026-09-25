import { useEffect, useState } from 'react'
import type { Cross, Pillar } from '../types/Cross'

type DailyProgress = {
  [crossId: string]: boolean
}

type DailyWalk = {
  date: string
  crossIds: string[]
  progress: DailyProgress
  gratitude: string
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
  const todayKey = getTodayKey()
  const walkStorageKey = `fourtold-daily-walk-${todayKey}`

  const [crosses] = useState<Cross[]>(loadCrosses)

  const [selectedCrossIds, setSelectedCrossIds] = useState<string[]>([])

  const [walk, setWalk] = useState<DailyWalk | null>(() => {
    const savedWalk = localStorage.getItem(walkStorageKey)

    if (!savedWalk) return null

    try {
      return JSON.parse(savedWalk)
    } catch {
      return null
    }
  })

  const [isGivingThanks, setIsGivingThanks] = useState(false)
  const [gratitudeText, setGratitudeText] = useState(
    walk?.gratitude ?? ''
  )

  useEffect(() => {
    if (!walk) return

    localStorage.setItem(
      walkStorageKey,
      JSON.stringify(walk)
    )
  }, [walk, walkStorageKey])

  function toggleSelection(id: string) {
    setSelectedCrossIds((current) => {
      if (current.includes(id)) {
        return current.filter((crossId) => crossId !== id)
      }

      return [...current, id]
    })
  }

  function beginWalk() {
    if (selectedCrossIds.length === 0) return

    const newWalk: DailyWalk = {
      date: todayKey,
      crossIds: selectedCrossIds,
      progress: {},
      gratitude: '',
    }

    setWalk(newWalk)

    localStorage.setItem(
      walkStorageKey,
      JSON.stringify(newWalk)
    )
  }

  function toggleCross(id: string) {
    setWalk((current) => {
      if (!current) return current

      return {
        ...current,
        progress: {
          ...current.progress,
          [id]: !current.progress[id],
        },
      }
    })
  }

  function saveGratitude() {
    const trimmedGratitude = gratitudeText.trim()

    if (!trimmedGratitude) return

    setWalk((current) => {
      if (!current) return current

      return {
        ...current,
        gratitude: trimmedGratitude,
      }
    })

    setGratitudeText(trimmedGratitude)
    setIsGivingThanks(false)
  }

  function cancelGratitude() {
    setGratitudeText(walk?.gratitude ?? '')
    setIsGivingThanks(false)
  }

  const walkCrosses = walk
    ? walk.crossIds
        .map((id) => crosses.find((cross) => cross.id === id))
        .filter((cross): cross is Cross => Boolean(cross))
    : []

  const completedCount = walk
    ? walkCrosses.filter(
        (cross) => walk.progress[cross.id]
      ).length
    : 0

  const allComplete =
    walkCrosses.length > 0 &&
    completedCount === walkCrosses.length

  /*
   * TAKE UP YOUR CROSS
   *
   * Choose what will become part of today's Walk.
   */
  if (!walk) {
    return (
      <main className="pillar-page">
        <p className="pillar-label">FOUR†OLD</p>

        <h1>TAKE UP YOUR CROSS</h1>

        <p>
          What will you carry faithfully today?
        </p>

        {crosses.length === 0 ? (
          <p>
            Begin by creating Crosses within your four pillars.
          </p>
        ) : (
          <>
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
                  <h2>{pillarNames[pillar]}</h2>

                  <ul>
                    {pillarCrosses.map((cross) => {
                      const isSelected =
                        selectedCrossIds.includes(cross.id)

                      return (
                        <li key={cross.id}>
                          <label>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() =>
                                toggleSelection(cross.id)
                              }
                            />

                            <span>{cross.name}</span>
                          </label>
                        </li>
                      )
                    })}
                  </ul>
                </section>
              )
            })}

            <button
              type="button"
              onClick={beginWalk}
              disabled={selectedCrossIds.length === 0}
            >
              Take Up Your Cross
            </button>
          </>
        )}
      </main>
    )
  }

  /*
   * TODAY'S WALK
   */
  return (
    <main className="pillar-page">
      <p className="pillar-label">FOUR†OLD</p>

      <h1>TODAY'S WALK</h1>

      {!allComplete && (
        <p>
          Walk faithfully with what you have chosen to carry.
        </p>
      )}

      <section className="todays-crosses">
        <p>
          {completedCount} of {walkCrosses.length} carried
        </p>

        {pillarOrder.map((pillar) => {
          const pillarCrosses = walkCrosses.filter(
            (cross) => cross.pillar === pillar
          )

          if (pillarCrosses.length === 0) return null

          return (
            <section
              key={pillar}
              className={`walk-pillar walk-${pillar}`}
            >
              <h2>{pillarNames[pillar]}</h2>

              <ul>
                {pillarCrosses.map((cross) => {
                  const isComplete = Boolean(
                    walk.progress[cross.id]
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

                        <span>{cross.name}</span>
                      </label>
                    </li>
                  )
                })}
              </ul>
            </section>
          )
        })}

        {allComplete && (
          <section className="walk-complete">
            <h2>TODAY'S WALK IS COMPLETE.</h2>

            <p>
              You carried what you committed to carry.
            </p>

            {!walk.gratitude && !isGivingThanks && (
              <>
                <button
                  type="button"
                  onClick={() => setIsGivingThanks(true)}
                >
                  Give Thanks
                </button>

                <p>
                  You will know by your fruit.
                </p>
              </>
            )}

            {isGivingThanks && (
              <div className="gratitude-entry">
                <h3>GIVE THANKS</h3>

                <p>
                  What are you grateful for today?
                </p>

                <textarea
                  value={gratitudeText}
                  onChange={(event) =>
                    setGratitudeText(event.target.value)
                  }
                  placeholder="Today I am grateful for..."
                  rows={5}
                  autoFocus
                />

                <div>
                  <button
                    type="button"
                    onClick={saveGratitude}
                    disabled={!gratitudeText.trim()}
                  >
                    Save Gratitude
                  </button>

                  <button
                    type="button"
                    onClick={cancelGratitude}
                  >
                    Not Now
                  </button>
                </div>
              </div>
            )}

            {walk.gratitude && !isGivingThanks && (
              <div className="gratitude-saved">
                <h3>GRATITUDE</h3>

                <p>
                  {walk.gratitude}
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setGratitudeText(walk.gratitude)
                    setIsGivingThanks(true)
                  }}
                >
                  Edit
                </button>

                <p>
                  You will know by your fruit.
                </p>
              </div>
            )}
          </section>
        )}
      </section>
    </main>
  )
}

export default Today