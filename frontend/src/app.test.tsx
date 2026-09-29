import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';
import { AppRoutes } from './app.tsx';

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AppRoutes />
    </MemoryRouter>,
  );
}

describe('routing', () => {
  it('shows the landing page at /', () => {
    renderAt('/');
    expect(screen.getByRole('heading', { level: 1, name: 'Schematophylax' })).toBeInTheDocument();
    for (const name of ['Postgres connections', 'Migrations', 'Migration logs']) {
      expect(screen.getByRole('heading', { level: 2, name })).toBeInTheDocument();
    }
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('goes to the sign-up form from the landing page', async () => {
    renderAt('/');
    await userEvent.click(screen.getByRole('link', { name: 'Create your group' }));
    expect(screen.getByRole('heading', { level: 1, name: 'Sign up' })).toBeInTheDocument();
  });

  it('goes back home from the sign-up form', async () => {
    renderAt('/signup');
    await userEvent.click(screen.getByRole('link', { name: '← Home' }));
    expect(screen.getByRole('heading', { level: 1, name: 'Schematophylax' })).toBeInTheDocument();
  });

  it('redirects unknown paths to /', () => {
    renderAt('/nope');
    expect(screen.getByRole('heading', { level: 1, name: 'Schematophylax' })).toBeInTheDocument();
  });
});
