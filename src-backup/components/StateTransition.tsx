import {
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react'

type StateTransitionProps = {
  transitionKey: string | number
  children: ReactNode
  className?: string
  duration?: number
}

function StateTransition({
  transitionKey,
  children,
  className = '',
  duration = 260,
}: StateTransitionProps) {
  const [displayedChildren, setDisplayedChildren] =
    useState(children)

  const [displayedKey, setDisplayedKey] =
    useState(transitionKey)

  const [phase, setPhase] = useState<
    'idle' | 'out' | 'in'
  >('idle')

  const timeoutRef =
    useRef<number | null>(null)

  useEffect(() => {
    if (transitionKey === displayedKey) {
      setDisplayedChildren(children)
      return
    }

    if (timeoutRef.current) {
      window.clearTimeout(
        timeoutRef.current
      )
    }

    setPhase('out')

    timeoutRef.current =
      window.setTimeout(() => {
        setDisplayedChildren(children)
        setDisplayedKey(transitionKey)
        setPhase('in')

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setPhase('idle')
          })
        })
      }, duration)

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(
          timeoutRef.current
        )
      }
    }
  }, [
    children,
    displayedKey,
    duration,
    transitionKey,
  ])

  return (
    <div
      className={[
        'state-transition',
        phase === 'out'
          ? 'is-leaving'
          : '',
        phase === 'in'
          ? 'is-entering'
          : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={
        {
          '--state-transition-duration':
            `${duration}ms`,
        } as React.CSSProperties
      }
    >
      {displayedChildren}
    </div>
  )
}

export default StateTransition