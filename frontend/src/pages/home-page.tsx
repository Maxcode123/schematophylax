import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import type { SignupResponse } from '../api/signup.ts';

/** Router state the sign-up page passes when it redirects here. */
export type HomeLocationState = { signedUp?: SignupResponse };

const features = [
  {
    title: 'Postgres connections',
    description: 'Register the databases your team works with, in one place.',
  },
  {
    title: 'Migrations',
    description: 'Keep every schema change as a versioned migration, ready to apply.',
  },
  {
    title: 'Migration logs',
    description: 'See which migrations ran against which database, and when.',
  },
];

export function HomePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [signedUp, setSignedUp] = useState((location.state as HomeLocationState | null)?.signedUp);

  // Browser history state survives reloads, so drop it once read to show the notice only once.
  useEffect(() => {
    if (location.state) navigate(location.pathname, { replace: true, state: null });
  }, [location, navigate]);

  return (
    <main className="home">
      {signedUp && (
        <div className="notice" role="status">
          <p>
            Welcome aboard! Created group <strong>{signedUp.userGroup.name}</strong> with{' '}
            <strong>{signedUp.user.email}</strong> as its first member.
          </p>
          <button type="button" className="dismiss" aria-label="Dismiss" onClick={() => setSignedUp(undefined)}>
            ×
          </button>
        </div>
      )}
      <h1>Schematophylax</h1>
      <p className="tagline">Keep your Postgres schemas under guard.</p>
      <p>Manage your Postgres connections and schema migrations together as a team.</p>
      <ul className="features">
        {features.map((feature) => (
          <li key={feature.title} className="feature">
            <h2>{feature.title}</h2>
            <p>{feature.description}</p>
          </li>
        ))}
      </ul>
      <Link to="/signup" className="button">
        Create your group
      </Link>
    </main>
  );
}
