import { useEffect, useState } from 'react'
import type { JournalEntry, JournalEntryType } from '../types/Journal'
import {
  addJournalEntry,
  loadJournal,
  updateJournalEntry,
  JOURNAL_UPDATED_EVENT,
} from '../utils/journalStorage.ts'

type Category = 'all' | 'struggle' | 'desire' | 'gratitude'
type WritingCategory = Exclude<Category, 'all'>

const categories: { id: WritingCategory; label: string; prompt: string; description: string }[] = [
  {
    id: 'struggle',
    label: 'Struggles',
    prompt: "What's weighing on your heart?",
    description: 'A place to be honest about what is difficult.',
  },
  {
    id: 'desire',
    label: 'Desires',
    prompt: 'Where do you hope to grow?',
    description: 'Name what you hope to pursue or become.',
  },
  {
    id: 'gratitude',
    label: 'Gratitude & Reflection',
    prompt: 'Where did you see goodness or fruit today?',
    description: 'Notice what matters, whether the day went as planned or not.',
  },
]

function localDateKey() {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function categoryFor(type: JournalEntryType): WritingCategory {
  return type === 'fruit' ? 'gratitude' : type
}

function formatJournalDate(date: string) {
  if (date === localDateKey()) return 'TODAY'
  const parsed = new Date(`${date}T12:00:00`)
  return Number.isNaN(parsed.getTime())
    ? date
    : parsed.toLocaleDateString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric',
      }).toUpperCase()
}

function Journal() {
  const [entries, setEntries] = useState<JournalEntry[]>(loadJournal)
  const [category, setCategory] = useState<Category>('all')
  const [writingCategory, setWritingCategory] = useState<WritingCategory | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draft, setDraft] = useState('')

  useEffect(() => {
    const refresh = () => setEntries(loadJournal())
    window.addEventListener(JOURNAL_UPDATED_EVENT, refresh)
    window.addEventListener('storage', refresh)
    return () => {
      window.removeEventListener(JOURNAL_UPDATED_EVENT, refresh)
      window.removeEventListener('storage', refresh)
    }
  }, [])

  const visibleEntries = entries
    .filter(entry => category === 'all' || categoryFor(entry.type) === category)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  function beginWriting(next: WritingCategory) {
    setCategory(next)
    setWritingCategory(next)
    setEditingId(null)
    setDraft('')
  }

  function beginEditing(entry: JournalEntry) {
    setCategory(categoryFor(entry.type))
    setWritingCategory(categoryFor(entry.type))
    setEditingId(entry.id)
    setDraft(entry.text)
  }

  function cancelWriting() {
    setWritingCategory(null)
    setEditingId(null)
    setDraft('')
  }

  function saveEntry() {
    const text = draft.trim()
    if (!text || !writingCategory) return

    if (editingId) {
      // Preserve the original entry type and its link to Today's Walk.
      updateJournalEntry(editingId, { text })
    } else {
      addJournalEntry({
        id: crypto.randomUUID(),
        type: writingCategory,
        text,
        date: localDateKey(),
        createdAt: new Date().toISOString(),
      })
    }
    setEntries(loadJournal())
    cancelWriting()
  }

  const active = categories.find(item => item.id === writingCategory)

  return (
    <main className="journal-page journal-experience">
      <header className="journal-header">
        <p className="journal-eyebrow">YOUR WALK</p>
        <h1>Journal</h1>
        <p className="journal-intro">
          A place to bring what is on your heart, recognize where you are growing,
          and remember what you are grateful for.
        </p>
      </header>

      <nav className="journal-categories" aria-label="Journal categories">
        <button type="button" className={category === 'all' ? 'is-active' : ''}
          aria-pressed={category === 'all'} onClick={() => { setCategory('all'); cancelWriting() }}>
          All entries
        </button>
        {categories.map(item => (
          <button key={item.id} type="button"
            className={category === item.id ? 'is-active' : ''}
            aria-pressed={category === item.id}
            onClick={() => { setCategory(item.id); cancelWriting() }}>
            {item.label}
          </button>
        ))}
      </nav>

      {!writingCategory && (
        <section className="journal-invitations" aria-label="Begin a journal entry">
          {categories.map(item => (
            <button type="button" key={item.id} className="journal-invitation"
              onClick={() => beginWriting(item.id)}>
              <span className="journal-invitation-title">{item.label}</span>
              <span className="journal-invitation-description">{item.description}</span>
              <span className="journal-invitation-action">Write an entry →</span>
            </button>
          ))}
        </section>
      )}

      {writingCategory && active && (
        <section className="journal-compose" aria-label={editingId ? 'Edit journal entry' : 'New journal entry'}>
          <p className="journal-compose-category">{active.label}</p>
          <h2>{editingId ? 'Revisit your words' : active.prompt}</h2>
          <label className="journal-visually-hidden" htmlFor="journal-draft">Journal entry</label>
          <textarea id="journal-draft" value={draft} onChange={event => setDraft(event.target.value)}
            rows={7} placeholder="Write what is on your heart..." />
          <div className="journal-compose-actions">
            <button type="button" className="journal-save" disabled={!draft.trim()} onClick={saveEntry}>
              {editingId ? 'Save Changes' : 'Save Entry'}
            </button>
            <button type="button" onClick={cancelWriting}>Cancel</button>
          </div>
        </section>
      )}

      <section className="journal-history" aria-label="Saved journal entries">
        <h2>{category === 'all' ? 'Your entries' : categories.find(item => item.id === category)?.label}</h2>
        {visibleEntries.length === 0 ? (
          <div className="journal-empty">
            <p>{category === 'all' ? 'Your journal will grow as you walk.' : 'Nothing recorded here yet.'}</p>
          </div>
        ) : (
          <div className="journal-list">
            {visibleEntries.map(entry => (
              <article key={entry.id} className={`journal-entry journal-entry--${entry.type}`}>
                <p className="journal-date">{formatJournalDate(entry.date)}</p>
                <p className="journal-type">{categories.find(item => item.id === categoryFor(entry.type))?.label}</p>
                <p className="journal-text">{entry.text}</p>
                <button type="button" className="journal-edit" onClick={() => beginEditing(entry)}>
                  Edit entry
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default Journal
