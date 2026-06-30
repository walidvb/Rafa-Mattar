import type { Core } from '@strapi/strapi';

const PAGE_ACTIONS = ['api::page.page.find', 'api::page.page.findOne'] as const;

async function enablePagePublicPermissions(strapi: Core.Strapi) {
  const publicRole = await strapi.db.query('plugin::users-permissions.role').findOne({
    where: { type: 'public' },
  });

  if (!publicRole) {
    return;
  }

  for (const action of PAGE_ACTIONS) {
    const permission = await strapi.db.query('plugin::users-permissions.permission').findOne({
      where: { action, role: publicRole.id },
    });

    if (permission) {
      if (!permission.enabled) {
        await strapi.db.query('plugin::users-permissions.permission').update({
          where: { id: permission.id },
          data: { enabled: true },
        });
      }
      continue;
    }

    await strapi.db.query('plugin::users-permissions.permission').create({
      data: {
        action,
        role: publicRole.id,
        enabled: true,
      },
    });
  }
}

export default {
  register({ strapi }: { strapi: Core.Strapi }) {
    strapi.server.httpServer?.once('listening', () => {
      void enablePagePublicPermissions(strapi);
    });
  },

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await enablePagePublicPermissions(strapi);
  },
};
