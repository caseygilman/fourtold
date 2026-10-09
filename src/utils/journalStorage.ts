import type { JournalEntry } from '../types/Journal'

const JOURNAL_STORAGE_KEY = 'fourtold-journal'
export const JOURNAL_UPDATED_EVENT = 'fourtold-journal-updated'

export function loadJournal(): JournalEntry[] {
  try {
    const raw = localStorage.getItem(JOURNAL_STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed as JournalEntry[] : []
  } catch {
    return []
  }
}

export function saveJournal(entries: JournalEntry[]) {
  localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(entries))
  window.dispatchEvent(new Event(JOURNAL_UPDATED_EVENT))
}

export function addJournalEntry(entry: JournalEntry) {
  saveJournal([...loadJournal(), entry])
}

export function updateJournalEntry(
  id: string,
  updates: Partial<JournalEntry>
) {
  const entries = loadJournal()
  const original = entries.find(entry => entry.id === id)
  if (!original) return

  const updated = { ...original, ...updates, id: original.id }
  // A Daily Walk may reference this entry. Keep its cached text in sync,
  // without changing other Walk fields or unrelated Journal entries.
  if (updated.text !== original.text) {
    const walkKey = `fourtold-daily-walk-${original.date}`
    const rawWalk = localStorage.getItem(walkKey)
    if (rawWalk) {
      try {
        const walk: unknown = JSON.parse(rawWalk)
        if (
          walk && typeof walk === 'object' &&
          'gratitudeJournalEntryId' in walk &&
          walk.gratitudeJournalEntryId === id
        ) {
          localStorage.setItem(walkKey, JSON.stringify({
            ...walk,
            gratitude: updated.text,
          }))
        }
      } catch {
        // Never overwrite an unreadable Walk.
      }
    }
  }

  saveJournal(entries.map(entry => entry.id === id ? updated : entry))
}
