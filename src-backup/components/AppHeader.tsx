import { Link } from 'react-router-dom'

function AppHeader() {
  return (
    <header className="app-header">
      <Link
        to="/home"
        className="app-header__brand"
        aria-label="FOURTOLD Home"
      >
        FOUR†OLD
      </Link>

      <Link
        to="/journal"
        className="app-header__journal"
        aria-label="Open Journal"
      >
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            d="M4 5.5C4 4.67 4.67 4 5.5 4H10.5C11.33 4 12 4.67 12 5.5V20C11.15 18.9 10.02 18.35 8.6 18.35H4V5.5Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <path
            d="M20 5.5C20 4.67 19.33 4 18.5 4H13.5C12.67 4 12 4.67 12 5.5V20C12.85 18.9 13.98 18.35 15.4 18.35H20V5.5Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Link>
    </header>
  )
}

export default AppHeader