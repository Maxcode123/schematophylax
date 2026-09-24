import { type FormEvent, useState } from 'react';
import { ApiError } from '../api/client.ts';
import { type SignupResponse, signup } from '../api/signup.ts';

function errorMessage(err: unknown): string {
  if (err instanceof ApiError) {
    if (err.status === 409 && err.body.constraint === 'User_email_key') return 'This email is already registered.';
    if (err.status === 400 && err.body.error) return err.body.error;
  }
  return 'Something went wrong. Please try again.';
}

export function SignupPage() {
  const [groupName, setGroupName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SignupResponse | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const trimmedUsername = username.trim();
      setResult(
        await signup({
          groupName: groupName.trim(),
          email: email.trim(),
          ...(trimmedUsername && { username: trimmedUsername }),
        }),
      );
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  if (result) {
    return (
      <main className="card">
        <h1>Welcome aboard</h1>
        <p>
          Created group <strong>{result.userGroup.name}</strong> with <strong>{result.user.email}</strong> as its first
          member.
        </p>
      </main>
    );
  }

  return (
    <main className="card">
      <h1>Sign up</h1>
      <p className="subtitle">Create a group for your team and your own account in it.</p>
      <form onSubmit={handleSubmit}>
        <label>
          Group name
          <input value={groupName} onChange={(e) => setGroupName(e.target.value)} required autoFocus />
        </label>
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
        </label>
        <label>
          Username <span className="optional">(optional)</span>
          <input value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" />
        </label>
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        <button type="submit" disabled={submitting}>
          {submitting ? 'Signing up…' : 'Sign up'}
        </button>
      </form>
    </main>
  );
}
