import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

import type { Cross, Pillar } from '../types/Cross'

const CROSS_STORAGE_KEY = 'fourtold-crosses'

const pillars: {
  key: Pillar
  label: string
  path: string
}[] = [
  {
    key: 'faith',
    label: 'Faith',
    path: '/faith',
  },
  {
    key: 'fitness',
    label: 'Fitness',
    path: '/fitness',
  },
  {
    key: 'finance',
    label: 'Finance',
    path: '/finance',
  },
  {
    key: 'family',
    label: 'Family',
    path: '/family',
  },
]

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

function Navigation() {
  const location = useLocation()

  const [crosses, setCrosses] = useState<Cross[]>(loadCrosses)

  useEffect(() => {
    setCrosses(loadCrosses())
  }, [location.pathname])

  const todayKey = getTodayKey()

  const todaysWalkExists = Boolean(
    localStorage.getItem(`fourtold-daily-walk-${todayKey}`)
  )

  const hasAnyCrosses = crosses.length > 0

  const todayIsReady =
    hasAnyCrosses && !todaysWalkExists

  function pillarHasCross(pillar: Pillar) {
    return crosses.some(
      (cross) => cross.pillar === pillar
    )
  }

  function renderPillar(
    pillar: (typeof pillars)[number]
  ) {
    const hasCross = pillarHasCross(pillar.key)

    return (
      <NavLink
        key={pillar.key}
        to={pillar.path}
        className={
          hasCross ? '' : 'pillar-needs-cross'
        }
      >
        <span className="pillar-nav-content">
          <span>{pillar.label}</span>

          <span
            className={`pillar-add-indicator ${
              hasCross ? 'is-complete' : ''
            }`}
            aria-hidden="true"
          >
            +
          </span>
        </span>
      </NavLink>
    )
  }

  return (
    <nav className="main-nav is-visible">
      {renderPillar(pillars[0])}

      {renderPillar(pillars[1])}

      <NavLink
        to="/today"
        className={`today-nav ${
          todayIsReady ? 'today-ready' : ''
        }`}
        aria-label={
          todaysWalkExists
            ? "Today's Walk"
            : 'Take Up Your Cross'
        }
      >
        †
      </NavLink>

      {renderPillar(pillars[2])}

      {renderPillar(pillars[3])}
    </nav>
  )
}

export default Navigation