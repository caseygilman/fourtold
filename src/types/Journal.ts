export type JournalEntryType =
  | 'gratitude'
  | 'fruit'
  | 'struggle'

export type JournalEntry = {
  id: string
  type: JournalEntryType
  text: string
  date: string
  createdAt: string

  /*
    These give us room to connect
    Journal entries to FOUR†OLD's
    larger system later without
    changing the basic Journal model.
  */
  pillar?: string
  crossIds?: string[]
}