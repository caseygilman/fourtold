import { useEffect, useState } from 'react'
import type { Cross, Pillar } from '../types/Cross'

type PillarPageProps = {
  pillar: Pillar
  title: string
  description: string
  verse?: string
  reference?: string
}

const CROSS_STORAGE_KEY = 'fourtold-crosses'

function loadCrosses(): Cross[] {
  const savedCrosses = localStorage.getItem(CROSS_STORAGE_KEY)

  if (!savedCrosses) return []

  try {
    return JSON.parse(savedCrosses)
  } catch {
    return []
  }
}

function PillarPage({
  pillar,
  title,
  description,
  verse,
  reference,
}: PillarPageProps) {
  const [crosses, setCrosses] = useState<Cross[]>(loadCrosses)

  const [isAdding, setIsAdding] = useState(false)
  const [newCross, setNewCross] = useState('')

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')

  const pillarCrosses = crosses.filter(
    (cross) => cross.pillar === pillar
  )

  useEffect(() => {
    localStorage.setItem(
      CROSS_STORAGE_KEY,
      JSON.stringify(crosses)
    )
  }, [crosses])

  function addCross() {
    const trimmedCross = newCross.trim()

    if (!trimmedCross) return

    const cross: Cross = {
      id: crypto.randomUUID(),
      name: trimmedCross,
      pillar,
    }

    setCrosses((current) => [...current, cross])

    setNewCross('')
    setIsAdding(false)
  }

  function startEditing(cross: Cross) {
    setEditingId(cross.id)
    setEditingName(cross.name)
  }

  function saveEdit() {
    const trimmedName = editingName.trim()

    if (!trimmedName || !editingId) return

    setCrosses((current) =>
      current.map((cross) =>
        cross.id === editingId
          ? { ...cross, name: trimmedName }
          : cross
      )
    )

    setEditingId(null)
    setEditingName('')
  }

  function cancelEdit() {
    setEditingId(null)
    setEditingName('')
  }

  function deleteCross(id: string) {
    setCrosses((current) =>
      current.filter((cross) => cross.id !== id)
    )
  }

  return (
    <main className="pillar-page">
      <p className="pillar-label">FOUR†OLD</p>

      <h1>{title}</h1>

      {verse && (
        <p className="pillar-verse">
          “{verse}”
        </p>
      )}

      {reference && (
        <p className="pillar-reference">
          {reference}
        </p>
      )}

      <section className="crosses">
        <h2>Your Crosses</h2>

        <p>{description}</p>

        {pillarCrosses.length > 0 && (
          <ul>
            {pillarCrosses.map((cross) => (
              <li key={cross.id}>
                {editingId === cross.id ? (
                  <div>
                    <input
                      type="text"
                      value={editingName}
                      onChange={(event) =>
                        setEditingName(event.target.value)
                      }
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') saveEdit()
                        if (event.key === 'Escape') cancelEdit()
                      }}
                      autoFocus
                    />

                    <button
                      type="button"
                      onClick={saveEdit}
                    >
                      Save
                    </button>

                    <button
                      type="button"
                      onClick={cancelEdit}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div>
                    <span>{cross.name}</span>

                    <button
                      type="button"
                      onClick={() => startEditing(cross)}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteCross(cross.id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}

        {isAdding ? (
          <div>
            <input
              type="text"
              value={newCross}
              onChange={(event) =>
                setNewCross(event.target.value)
              }
              onKeyDown={(event) => {
                if (event.key === 'Enter') addCross()

                if (event.key === 'Escape') {
                  setNewCross('')
                  setIsAdding(false)
                }
              }}
              placeholder="What will you carry?"
              autoFocus
            />

            <button
              type="button"
              onClick={addCross}
            >
              Add
            </button>

            <button
              type="button"
              onClick={() => {
                setNewCross('')
                setIsAdding(false)
              }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsAdding(true)}
          >
            + Add a Cross
          </button>
        )}
      </section>
    </main>
  )
}

export default PillarPage