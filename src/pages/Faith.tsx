import { useEffect, useState } from 'react'

type Cross = {
  id: string
  name: string
}

function Faith() {
  const [crosses, setCrosses] = useState<Cross[]>(() => {
    const savedCrosses = localStorage.getItem('fourtold-faith-crosses')

    if (!savedCrosses) return []

    try {
      const parsedCrosses = JSON.parse(savedCrosses)

      // Migrate our original string-based Crosses
      if (
        Array.isArray(parsedCrosses) &&
        parsedCrosses.every((cross) => typeof cross === 'string')
      ) {
        return parsedCrosses.map((cross) => ({
          id: crypto.randomUUID(),
          name: cross,
        }))
      }

      return parsedCrosses
    } catch {
      return []
    }
  })

  const [isAdding, setIsAdding] = useState(false)
  const [newCross, setNewCross] = useState('')

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')

  useEffect(() => {
    localStorage.setItem(
      'fourtold-faith-crosses',
      JSON.stringify(crosses)
    )
  }, [crosses])

  function addCross() {
    const trimmedCross = newCross.trim()

    if (!trimmedCross) return

    const cross: Cross = {
      id: crypto.randomUUID(),
      name: trimmedCross,
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

      <h1>FAITH</h1>

      <p className="pillar-verse">
        “If anyone would come after me, let him deny himself
        and take up his cross daily and follow me.”
      </p>

      <p className="pillar-reference">Luke 9:23</p>

      <section className="crosses">
        <h2>Your Crosses</h2>

        <p>The practices you choose to carry faithfully.</p>

        {crosses.length > 0 && (
          <ul>
            {crosses.map((cross) => (
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

                    <button type="button" onClick={saveEdit}>
                      Save
                    </button>

                    <button type="button" onClick={cancelEdit}>
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
              onChange={(event) => setNewCross(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') addCross()

                if (event.key === 'Escape') {
                  setNewCross('')
                  setIsAdding(false)
                }
              }}
              placeholder="e.g. Morning prayer"
              autoFocus
            />

            <button type="button" onClick={addCross}>
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

export default Faith