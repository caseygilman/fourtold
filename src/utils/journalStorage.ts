import type {
  JournalEntry,
} from '../types/Journal'

const JOURNAL_STORAGE_KEY =
  'fourtold-journal'

export function loadJournal():
  JournalEntry[] {
  const savedJournal =
    localStorage.getItem(
      JOURNAL_STORAGE_KEY
    )

  if (!savedJournal) {
    return []
  }

  try {
    return JSON.parse(
      savedJournal
    )
  } catch {
    return []
  }
}

export function saveJournal(
  entries: JournalEntry[]
) {
  localStorage.setItem(
    JOURNAL_STORAGE_KEY,
    JSON.stringify(entries)
  )
}

export function addJournalEntry(
  entry: JournalEntry
) {
  const journal =
    loadJournal()

  saveJournal([
    ...journal,
    entry,
  ])
}

export function updateJournalEntry(
  id: string,
  updates: Partial<
    JournalEntry
  >
) {
  const journal =
    loadJournal()

  const updatedJournal =
    journal.map(
      (entry) =>
        entry.id === id
          ? {
              ...entry,
              ...updates,
            }
          : entry
    )

  saveJournal(
    updatedJournal
  )
}