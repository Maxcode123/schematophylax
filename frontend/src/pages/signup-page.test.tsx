import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import type { SignupResponse } from '../api/signup.ts';
import { AppRoutes } from '../app.tsx';

const signupResponse: SignupResponse = {
  userGroup: { id: 'g1', name: 'Acme', createdAt: 'now', updatedAt: 'now' },
  user: {
    id: 'u1',
    userGroupId: 'g1',
    email: 'ada@example.com',
    username: null,
    createdAt: 'now',
    updatedAt: 'now',
  },
};

function mockFetch(status: number, body: unknown) {
  return vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify(body), { status }));
}

async function submitSignup({ username = '' } = {}) {
  render(
    <MemoryRouter initialEntries={['/signup']}>
      <AppRoutes />
    </MemoryRouter>,
  );
  await userEvent.type(screen.getByLabelText('Group name'), '  Acme ');
  await userEvent.type(screen.getByLabelText('Email'), 'ada@example.com');
  if (username) await userEvent.type(screen.getByLabelText(/Username/), username);
  await userEvent.click(screen.getByRole('button', { name: 'Sign up' }));
}

describe('sign-up', () => {
  it('redirects home with a dismissible welcome notice', async () => {
    const fetch = mockFetch(201, signupResponse);
    await submitSignup();

    expect(fetch).toHaveBeenCalledOnce();
    const [url, init] = fetch.mock.calls[0]!;
    expect(url).toBe('/api/signup');
    expect(JSON.parse(init!.body as string)).toEqual({ groupName: 'Acme', email: 'ada@example.com' });

    expect(await screen.findByRole('heading', { level: 1, name: 'Schematophylax' })).toBeInTheDocument();
    const notice = screen.getByRole('status');
    expect(notice).toHaveTextContent('Welcome aboard! Created group Acme with ada@example.com as its first member.');

    await userEvent.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('sends the username when given', async () => {
    const fetch = mockFetch(201, signupResponse);
    await submitSignup({ username: ' ada ' });
    expect(JSON.parse(fetch.mock.calls[0]![1]!.body as string)).toEqual({
      groupName: 'Acme',
      email: 'ada@example.com',
      username: 'ada',
    });
  });

  it.each([
    { status: 409, body: { constraint: 'User_email_key' }, message: 'This email is already registered.' },
    { status: 400, body: { error: 'groupName must not be empty' }, message: 'groupName must not be empty' },
    { status: 500, body: {}, message: 'Something went wrong. Please try again.' },
  ])('stays on the form and shows an error on $status', async ({ status, body, message }) => {
    mockFetch(status, body);
    await submitSignup();
    expect(await screen.findByRole('alert')).toHaveTextContent(message);
    expect(screen.getByRole('heading', { level: 1, name: 'Sign up' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign up' })).toBeEnabled();
  });
});
