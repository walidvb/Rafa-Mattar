import type { Core } from '@strapi/strapi';

const PUBLIC_ACTIONS = [
  'api::page.page.find',
  'api::page.page.findOne',
  'api::site-config.site-config.find',
] as const;

async function enablePublicReadPermissions(strapi: Core.Strapi) {
  const publicRole = await strapi.db.query('plugin::users-permissions.role').findOne({
    where: { type: 'public' },
  });

  if (!publicRole) {
    return;
  }

  for (const action of PUBLIC_ACTIONS) {
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
      void enablePublicReadPermissions(strapi);
    });
  },

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await enablePublicReadPermissions(strapi);
  },
};
