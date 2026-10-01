import { Link } from 'react-router-dom'

function Home() {
  return (
    <main className="home-page">
      <section className="home-content">
        <p className="home-eyebrow">
          TODAY
        </p>

        <h1 className="home-title">
          What has been entrusted
          to you?
        </h1>

        <p className="home-intro">
          Faith. Fitness. Finance.
          Family.
        </p>

        <div className="home-rule" />

        <p className="home-prompt">
          Live faithfully today in
          light of what is to come.
        </p>

        <Link
          to="/today"
          className="home-primary-action"
        >
          Continue Today’s Walk
          <span aria-hidden="true">
            →
          </span>
        </Link>
      </section>
    </main>
  )
}

export default Home