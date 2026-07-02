import Head from 'next/head';
import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';

import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { login } from '../features/admin/api';

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(password);
      await router.push('/');
    } catch {
      setError('Invalid password');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>Admin login</title>
      </Head>
      <div className="admin-root flex min-h-screen items-center justify-center bg-gray-50 px-4 font-sans text-sm text-gray-900 antialiased">
        <div className="w-full max-w-sm">
          <div className="mb-6 text-center">
            <h1 className="text-lg font-semibold text-gray-900">Admin</h1>
            <p className="mt-1 text-gray-500">Sign in to manage content</p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoFocus
                />
              </div>
              {error ? <p className="text-red-600">{error}</p> : null}
              <Button type="submit" disabled={loading} className="w-full" size="sm">
                {loading ? 'Signing in…' : 'Sign in'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
