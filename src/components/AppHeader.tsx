import { Link } from 'react-router-dom'

function AppHeader() {
  return (
    <header className="app-header">
      <Link
        to="/home"
        className="app-header__brand"
        aria-label="FOURTOLD Home"
      >
        <img
          src={`${import.meta.env.BASE_URL}branding/fourtold-wordmark.png`}
          alt=""
          className="app-header__brand-image"
        />
      </Link>

      <Link
        to="/journal"
        className="app-header__journal"
        aria-label="Open Journal"
      >
        <img
          src={`${import.meta.env.BASE_URL}branding/journal.png`}
          alt=""
          className="app-header__journal-image"
        />
      </Link>
    </header>
  )
}

export default AppHeader