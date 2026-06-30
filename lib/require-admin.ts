import type { GetServerSidePropsContext } from 'next';

import { isAdminAuthenticated } from './admin-auth';

export function requireAdmin(context: GetServerSidePropsContext) {
  if (!isAdminAuthenticated(context.req)) {
    return {
      redirect: {
        destination: '/admin/login',
        permanent: false,
      },
    } as const;
  }

  return null;
}
