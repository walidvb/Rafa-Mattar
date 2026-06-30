export default {
  routes: [
    {
      method: 'POST',
      path: '/pages/:documentId/publish',
      handler: 'page.publish',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/pages/:documentId/unpublish',
      handler: 'page.unpublish',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
