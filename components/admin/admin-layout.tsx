import Head from 'next/head';
import Link from 'next/link';
import { ReactNode } from 'react';

import { Button } from '../ui/button';
import { logout } from '../../features/admin/api';

interface AdminLayoutProps {
  title: string;
  children: ReactNode;
  backHref?: string;
  backLabel?: string;
  subtitle?: string;
  headerActions?: ReactNode;
}

export function AdminLayout({
  title,
  children,
  backHref,
  backLabel = 'Back',
  subtitle,
  headerActions,
}: AdminLayoutProps) {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div className="admin-root min-h-screen bg-gray-50 font-sans text-sm text-gray-900 antialiased">
        <header className="border-b border-gray-200 bg-white">
          <div className="mx-auto flex h-12 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              {backHref ? (
                <Link
                  href={backHref}
                  className="shrink-0 text-gray-500 transition-colors hover:text-gray-900"
                >
                  ← {backLabel}
                </Link>
              ) : (
                <span className="shrink-0 font-semibold text-gray-900">Admin</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {headerActions}
              {!backHref ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    await logout();
                    window.location.href = '/admin/login';
                  }}
                >
                  Log out
                </Button>
              ) : null}
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-5xl px-4 py-5 sm:px-6">
          <div className="mb-5">
            <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
            {subtitle ? <p className="mt-0.5 text-gray-500">{subtitle}</p> : null}
          </div>
          {children}
        </main>
      </div>
    </>
  );
}
