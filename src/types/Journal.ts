export type JournalEntryType =
  | 'gratitude'
  | 'fruit'
  | 'struggle'
  | 'desire'

export type JournalEntry = {
  id: string
  type: JournalEntryType
  text: string
  date: string
  createdAt: string
  pillar?: string
  crossIds?: string[]
}
