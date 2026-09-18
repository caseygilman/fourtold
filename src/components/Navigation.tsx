import { NavLink } from 'react-router-dom'

function Navigation() {
  return (
    <nav className="main-nav is-visible">
      <NavLink to="/faith">Faith</NavLink>
      <NavLink to="/fitness">Fitness</NavLink>
      <NavLink to="/finance">Finance</NavLink>
      <NavLink to="/family">Family</NavLink>
    </nav>
  )
}

export default Navigation