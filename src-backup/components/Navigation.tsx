import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

import type { Cross, Pillar } from '../types/Cross'

const CROSS_STORAGE_KEY = 'fourtold-crosses'
const ONBOARDING_STORAGE_KEY = 'fourtold-onboarding-complete'
const CROSS_UPDATE_EVENT = 'fourtold-crosses-updated'

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
  const savedCrosses =
    localStorage.getItem(CROSS_STORAGE_KEY)

  if (!savedCrosses) return []

  try {
    return JSON.parse(savedCrosses)
  } catch {
    return []
  }
}

function Navigation() {
  const location = useLocation()

  const [crosses, setCrosses] =
    useState<Cross[]>(loadCrosses)

  const [pillarHintDismissed, setPillarHintDismissed] =
    useState(false)

  useEffect(() => {
    setCrosses(loadCrosses())
  }, [location.pathname])

  /*
    localStorage's native "storage" event does not fire
    in the same browser tab that made the change.

    FOUR†OLD therefore uses a small custom event so the
    navigation can react immediately when Crosses change.
  */
  useEffect(() => {
    function handleCrossUpdate() {
      setCrosses(loadCrosses())
    }

    window.addEventListener(
      CROSS_UPDATE_EVENT,
      handleCrossUpdate
    )

    return () => {
      window.removeEventListener(
        CROSS_UPDATE_EVENT,
        handleCrossUpdate
      )
    }
  }, [])

  const todayKey = getTodayKey()

  const todaysWalkExists = Boolean(
    localStorage.getItem(
      `fourtold-daily-walk-${todayKey}`
    )
  )

  const onboardingComplete =
    localStorage.getItem(
      ONBOARDING_STORAGE_KEY
    ) === 'true'

  const hasAnyCrosses =
    crosses.length > 0

  const todayIsReady =
    hasAnyCrosses &&
    !todaysWalkExists

  const showPillarHint =
    location.pathname === '/today' &&
    !onboardingComplete &&
    !hasAnyCrosses &&
    !pillarHintDismissed

  function pillarHasCross(
    pillar: Pillar
  ) {
    return crosses.some(
      (cross) =>
        cross.pillar === pillar
    )
  }

  function handlePillarClick() {
    if (
      !onboardingComplete &&
      !hasAnyCrosses
    ) {
      setPillarHintDismissed(true)
    }
  }

  function renderPillar(
    pillar: (typeof pillars)[number]
  ) {
    const hasCross =
      pillarHasCross(pillar.key)

    return (
      <NavLink
        key={pillar.key}
        to={pillar.path}
        onClick={handlePillarClick}
        className={`${
          hasCross
            ? ''
            : 'pillar-needs-cross'
        } ${
          showPillarHint
            ? 'onboarding-pillar'
            : ''
        }`}
      >
        <span className="pillar-nav-content">
          <span>
            {pillar.label}
          </span>

          <span
            className={`pillar-add-indicator ${
              hasCross
                ? 'is-complete'
                : ''
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
    <>
      {showPillarHint && (
        <aside
          className="onboarding-hint"
          role="status"
        >
          <p className="onboarding-eyebrow">
            BEGIN HERE
          </p>

          <p className="onboarding-message">
            Choose a pillar below.
            <br />
            Add a Cross you will carry.
          </p>
        </aside>
      )}

      <nav className="main-nav is-visible">
        {renderPillar(pillars[0])}

        {renderPillar(pillars[1])}

        <NavLink
          to={
            hasAnyCrosses
              ? '/today'
              : '#'
          }
          className={`today-nav ${
            todayIsReady
              ? 'today-ready'
              : ''
          } ${
            !hasAnyCrosses
              ? 'today-disabled'
              : ''
          }`}
          onClick={(event) => {
            if (!hasAnyCrosses) {
              event.preventDefault()
            }
          }}
          aria-label={
            hasAnyCrosses
              ? todaysWalkExists
                ? "Today's Walk"
                : 'Take Up Your Cross'
              : 'Create a Cross first'
          }
          aria-disabled={
            !hasAnyCrosses
          }
          tabIndex={
            !hasAnyCrosses
              ? -1
              : 0
          }
        >
          †
        </NavLink>

        {renderPillar(pillars[2])}

        {renderPillar(pillars[3])}
      </nav>
    </>
  )
}

export default Navigation