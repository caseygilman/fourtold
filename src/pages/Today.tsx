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
  const savedCrosses =
    localStorage.getItem(CROSS_STORAGE_KEY)

  if (!savedCrosses) return []

  try {
    return JSON.parse(savedCrosses)
  } catch {
    return []
  }
}

function Today() {
  const todayKey = getTodayKey()

  const walkStorageKey =
    `fourtold-daily-walk-${todayKey}`

  const [crosses, setCrosses] =
    useState<Cross[]>(loadCrosses)

  const [
    selectedCrossIds,
    setSelectedCrossIds,
  ] = useState<string[]>([])

  const [
    additionalCrossIds,
    setAdditionalCrossIds,
  ] = useState<string[]>([])

  const [
    isAddingToWalk,
    setIsAddingToWalk,
  ] = useState(false)

  const [
    isCreatingCross,
    setIsCreatingCross,
  ] = useState(false)

  const [
    newCrossPillar,
    setNewCrossPillar,
  ] = useState<Pillar | null>(null)

  const [
    newCrossName,
    setNewCrossName,
  ] = useState('')

  const [walk, setWalk] =
    useState<DailyWalk | null>(() => {
      const savedWalk =
        localStorage.getItem(walkStorageKey)

      if (!savedWalk) return null

      try {
        return JSON.parse(savedWalk)
      } catch {
        return null
      }
    })

  const [
    isGivingThanks,
    setIsGivingThanks,
  ] = useState(false)

  const [
    gratitudeText,
    setGratitudeText,
  ] = useState(
    walk?.gratitude ?? ''
  )

  useEffect(() => {
    localStorage.setItem(
      CROSS_STORAGE_KEY,
      JSON.stringify(crosses)
    )
  }, [crosses])

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
        return current.filter(
          (crossId) => crossId !== id
        )
      }

      return [...current, id]
    })
  }

  function beginWalk() {
    if (selectedCrossIds.length === 0) {
      return
    }

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

  function toggleAdditionalCross(id: string) {
    setAdditionalCrossIds((current) => {
      if (current.includes(id)) {
        return current.filter(
          (crossId) => crossId !== id
        )
      }

      return [...current, id]
    })
  }

  function addToWalk() {
    if (additionalCrossIds.length === 0) {
      return
    }

    setWalk((current) => {
      if (!current) return current

      const newIds =
        additionalCrossIds.filter(
          (id) =>
            !current.crossIds.includes(id)
        )

      return {
        ...current,
        crossIds: [
          ...current.crossIds,
          ...newIds,
        ],
      }
    })

    setAdditionalCrossIds([])
    setIsAddingToWalk(false)
  }

  function cancelAddToWalk() {
    setAdditionalCrossIds([])
    setIsAddingToWalk(false)
    setIsCreatingCross(false)
    setNewCrossPillar(null)
    setNewCrossName('')
  }

  function startCreatingCross() {
    setIsCreatingCross(true)
    setNewCrossPillar(null)
    setNewCrossName('')
  }

  function cancelCreatingCross() {
    setIsCreatingCross(false)
    setNewCrossPillar(null)
    setNewCrossName('')
  }

  function createCrossAndAddToWalk() {
    const trimmedName =
      newCrossName.trim()

    if (
      !trimmedName ||
      !newCrossPillar
    ) {
      return
    }

    const newCross: Cross = {
      id: crypto.randomUUID(),
      name: trimmedName,
      pillar: newCrossPillar,
    }

    const updatedCrosses = [
      ...crosses,
      newCross,
    ]

    setCrosses(updatedCrosses)

    localStorage.setItem(
      CROSS_STORAGE_KEY,
      JSON.stringify(updatedCrosses)
    )

    setWalk((current) => {
      if (!current) return current

      return {
        ...current,
        crossIds: [
          ...current.crossIds,
          newCross.id,
        ],
      }
    })

    setNewCrossName('')
    setNewCrossPillar(null)
    setIsCreatingCross(false)
    setIsAddingToWalk(false)
  }

  function saveGratitude() {
    const trimmedGratitude =
      gratitudeText.trim()

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
    setGratitudeText(
      walk?.gratitude ?? ''
    )

    setIsGivingThanks(false)
  }

  const walkCrosses = walk
    ? walk.crossIds
        .map((id) =>
          crosses.find(
            (cross) => cross.id === id
          )
        )
        .filter(
          (cross): cross is Cross =>
            Boolean(cross)
        )
    : []

  const availableCrosses = walk
    ? crosses.filter(
        (cross) =>
          !walk.crossIds.includes(cross.id)
      )
    : []

  const completedCount = walk
    ? walkCrosses.filter(
        (cross) =>
          walk.progress[cross.id]
      ).length
    : 0

  const allComplete =
    walkCrosses.length > 0 &&
    completedCount === walkCrosses.length

  /*
    No valid Walk exists yet.

    This also catches stale Walk data whose
    Cross IDs no longer exist.
  */
  if (!walk || walkCrosses.length === 0) {
    return (
      <main className="pillar-page">
        <p className="pillar-label">
          FOUR†OLD
        </p>

        <h1>TAKE UP YOUR CROSS</h1>

        <p>
          What will you carry faithfully today?
        </p>

        {crosses.length === 0 ? (
          <p>
            Begin by creating Crosses within
            your four pillars.
          </p>
        ) : (
          <>
            {pillarOrder.map((pillar) => {
              const pillarCrosses =
                crosses.filter(
                  (cross) =>
                    cross.pillar === pillar
                )

              if (
                pillarCrosses.length === 0
              ) {
                return null
              }

              return (
                <section
                  key={pillar}
                  className={
                    `walk-pillar walk-${pillar}`
                  }
                >
                  <h2>
                    {pillarNames[pillar]}
                  </h2>

                  <ul>
                    {pillarCrosses.map(
                      (cross) => {
                        const isSelected =
                          selectedCrossIds.includes(
                            cross.id
                          )

                        return (
                          <li key={cross.id}>
                            <button
                              type="button"
                              className={
                                `cross-choice ${
                                  isSelected
                                    ? 'is-selected'
                                    : ''
                                }`
                              }
                              onClick={() =>
                                toggleSelection(
                                  cross.id
                                )
                              }
                              aria-pressed={
                                isSelected
                              }
                            >
                              <span
                                className="cross-mark"
                                aria-hidden="true"
                              >
                                †
                              </span>

                              <span className="cross-name">
                                {cross.name}
                              </span>
                            </button>
                          </li>
                        )
                      }
                    )}
                  </ul>
                </section>
              )
            })}

            <button
              type="button"
              className="begin-walk-button"
              onClick={beginWalk}
              disabled={
                selectedCrossIds.length === 0
              }
            >
              Take Up Your Cross
            </button>
          </>
        )}
      </main>
    )
  }

  return (
    <main className="pillar-page">
      <p className="pillar-label">
        FOUR†OLD
      </p>

      <h1>TODAY'S WALK</h1>

      {!allComplete && (
        <p>
          Walk faithfully with what you have
          chosen to carry.
        </p>
      )}

      <section className="todays-crosses">
        <p className="walk-progress">
          {completedCount} of{' '}
          {walkCrosses.length} carried
        </p>

        {pillarOrder.map((pillar) => {
          const pillarCrosses =
            walkCrosses.filter(
              (cross) =>
                cross.pillar === pillar
            )

          if (
            pillarCrosses.length === 0
          ) {
            return null
          }

          return (
            <section
              key={pillar}
              className={
                `walk-pillar walk-${pillar}`
              }
            >
              <h2>
                {pillarNames[pillar]}
              </h2>

              <ul>
                {pillarCrosses.map(
                  (cross) => {
                    const isComplete =
                      Boolean(
                        walk.progress[
                          cross.id
                        ]
                      )

                    return (
                      <li key={cross.id}>
                        <button
                          type="button"
                          className={
                            `cross-choice ${
                              isComplete
                                ? 'is-carried'
                                : ''
                            }`
                          }
                          onClick={() =>
                            toggleCross(
                              cross.id
                            )
                          }
                          aria-pressed={
                            isComplete
                          }
                        >
                          <span
                            className="cross-mark"
                            aria-hidden="true"
                          >
                            †
                          </span>

                          <span className="cross-name">
                            {cross.name}
                          </span>
                        </button>
                      </li>
                    )
                  }
                )}
              </ul>
            </section>
          )
        })}

        {!isAddingToWalk && (
          <button
            type="button"
            className="add-to-walk-button"
            onClick={() =>
              setIsAddingToWalk(true)
            }
          >
            + Add to Today's Walk
          </button>
        )}

        {isAddingToWalk && (
          <section className="add-to-walk">
            {!isCreatingCross ? (
              <>
                <div className="add-to-walk-heading">
                  <h2>
                    ADD TO TODAY'S WALK
                  </h2>

                  <p>
                    What else will you carry
                    faithfully today?
                  </p>
                </div>

                {availableCrosses.length > 0 ? (
                  <>
                    {pillarOrder.map(
                      (pillar) => {
                        const pillarCrosses =
                          availableCrosses.filter(
                            (cross) =>
                              cross.pillar ===
                              pillar
                          )

                        if (
                          pillarCrosses.length ===
                          0
                        ) {
                          return null
                        }

                        return (
                          <section
                            key={pillar}
                            className={
                              `walk-pillar walk-${pillar}`
                            }
                          >
                            <h2>
                              {
                                pillarNames[
                                  pillar
                                ]
                              }
                            </h2>

                            <ul>
                              {pillarCrosses.map(
                                (cross) => {
                                  const isSelected =
                                    additionalCrossIds.includes(
                                      cross.id
                                    )

                                  return (
                                    <li
                                      key={
                                        cross.id
                                      }
                                    >
                                      <button
                                        type="button"
                                        className={
                                          `cross-choice ${
                                            isSelected
                                              ? 'is-selected'
                                              : ''
                                          }`
                                        }
                                        onClick={() =>
                                          toggleAdditionalCross(
                                            cross.id
                                          )
                                        }
                                        aria-pressed={
                                          isSelected
                                        }
                                      >
                                        <span
                                          className="cross-mark"
                                          aria-hidden="true"
                                        >
                                          †
                                        </span>

                                        <span className="cross-name">
                                          {
                                            cross.name
                                          }
                                        </span>
                                      </button>
                                    </li>
                                  )
                                }
                              )}
                            </ul>
                          </section>
                        )
                      }
                    )}

                    <div className="add-to-walk-actions">
                      <button
                        type="button"
                        onClick={addToWalk}
                        disabled={
                          additionalCrossIds.length ===
                          0
                        }
                      >
                        Add Selected
                      </button>

                      <button
                        type="button"
                        onClick={
                          cancelAddToWalk
                        }
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <p>
                    All of your existing Crosses
                    are already part of today's
                    Walk.
                  </p>
                )}

                <button
                  type="button"
                  className="create-cross-button"
                  onClick={
                    startCreatingCross
                  }
                >
                  + Create a New Cross
                </button>

                {availableCrosses.length === 0 && (
                  <button
                    type="button"
                    onClick={
                      cancelAddToWalk
                    }
                  >
                    Cancel
                  </button>
                )}
              </>
            ) : (
              <div className="create-cross">
                <div className="add-to-walk-heading">
                  <h2>
                    CREATE A NEW CROSS
                  </h2>

                  <p>
                    Which pillar does this
                    belong to?
                  </p>
                </div>

                <div className="pillar-picker">
                  {pillarOrder.map(
                    (pillar) => (
                      <button
                        key={pillar}
                        type="button"
                        className={
                          newCrossPillar ===
                          pillar
                            ? 'is-selected'
                            : ''
                        }
                        onClick={() =>
                          setNewCrossPillar(
                            pillar
                          )
                        }
                        aria-pressed={
                          newCrossPillar ===
                          pillar
                        }
                      >
                        {pillarNames[pillar]}
                      </button>
                    )
                  )}
                </div>

                {newCrossPillar && (
                  <div className="new-cross-entry">
                    <label htmlFor="new-cross-name">
                      What will you carry?
                    </label>

                    <input
                      id="new-cross-name"
                      type="text"
                      value={newCrossName}
                      onChange={(event) =>
                        setNewCrossName(
                          event.target.value
                        )
                      }
                      onKeyDown={(event) => {
                        if (
                          event.key === 'Enter'
                        ) {
                          createCrossAndAddToWalk()
                        }

                        if (
                          event.key === 'Escape'
                        ) {
                          cancelCreatingCross()
                        }
                      }}
                      placeholder="Name this Cross"
                      autoFocus
                    />

                    <div className="add-to-walk-actions">
                      <button
                        type="button"
                        onClick={
                          createCrossAndAddToWalk
                        }
                        disabled={
                          !newCrossName.trim()
                        }
                      >
                        Create & Add
                      </button>

                      <button
                        type="button"
                        onClick={
                          cancelCreatingCross
                        }
                      >
                        Back
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>
        )}

        {allComplete && (
          <section className="walk-complete">
            <h2>
              TODAY'S WALK IS COMPLETE.
            </h2>

            <p>
              You carried what you committed
              to carry.
            </p>

            {!walk.gratitude &&
              !isGivingThanks && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setIsGivingThanks(true)
                    }
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
                  What are you grateful for
                  today?
                </p>

                <textarea
                  value={gratitudeText}
                  onChange={(event) =>
                    setGratitudeText(
                      event.target.value
                    )
                  }
                  placeholder="Today I am grateful for..."
                  rows={5}
                  autoFocus
                />

                <div>
                  <button
                    type="button"
                    onClick={saveGratitude}
                    disabled={
                      !gratitudeText.trim()
                    }
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

            {walk.gratitude &&
              !isGivingThanks && (
                <div className="gratitude-saved">
                  <h3>GRATITUDE</h3>

                  <p>
                    {walk.gratitude}
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setGratitudeText(
                        walk.gratitude
                      )

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