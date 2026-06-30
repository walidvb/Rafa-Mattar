import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::page.page', ({ strapi }) => ({
  async publish(ctx) {
    const { documentId } = ctx.params;

    await strapi.documents('api::page.page').publish({ documentId });

    ctx.body = { ok: true };
  },

  async unpublish(ctx) {
    const { documentId } = ctx.params;

    await strapi.documents('api::page.page').unpublish({ documentId });

    ctx.body = { ok: true };
  },
}));
