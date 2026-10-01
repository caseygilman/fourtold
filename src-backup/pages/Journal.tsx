import { useState } from 'react'

import type {
  JournalEntry,
} from '../types/Journal'

import {
  loadJournal,
} from '../utils/journalStorage'

function formatJournalDate(
  date: string
) {
  const today =
    new Date()
      .toISOString()
      .slice(0, 10)

  if (date === today) {
    return 'TODAY'
  }

  return new Date(
    `${date}T12:00:00`
  )
    .toLocaleDateString(
      'en-US',
      {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }
    )
    .toUpperCase()
}

function Journal() {
  const [entries] =
    useState<JournalEntry[]>(
      () => loadJournal()
    )

  const sortedEntries =
    [...entries].sort(
      (a, b) =>
        new Date(b.createdAt)
          .getTime() -
        new Date(a.createdAt)
          .getTime()
    )

  return (
    <main className="journal-page">
      <header className="journal-header">
        <p className="journal-eyebrow">
          YOUR WALK
        </p>

        <h1>Journal</h1>

        <p className="journal-intro">
          A record of what you
          carried, noticed, and
          learned along the way.
        </p>
      </header>

      {sortedEntries.length === 0 ? (
        <div className="journal-empty">
          <p>
            Your journal will grow
            as you walk.
          </p>
        </div>
      ) : (
        <section className="journal-list">
          {sortedEntries.map(
            (entry) => (
              <article
                key={entry.id}
                className={`journal-entry journal-entry--${entry.type}`}
              >
                <p className="journal-date">
                  {formatJournalDate(
                    entry.date
                  )}
                </p>

                <p className="journal-type">
                  {entry.type}
                </p>

                <p className="journal-text">
                  {entry.text}
                </p>
              </article>
            )
          )}
        </section>
      )}
    </main>
  )
}

export default Journal