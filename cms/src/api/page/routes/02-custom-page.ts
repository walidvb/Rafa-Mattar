export default {
  routes: [
    {
      method: 'POST',
      path: '/pages/:documentId/actions/publish',
      handler: 'page.publish',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/pages/:documentId/actions/unpublish',
      handler: 'page.unpublish',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
