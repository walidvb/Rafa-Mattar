import { createClient } from 'contentful'


export const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID as string,
  environment: 'master', // defaults to 'master' if not set
  accessToken: process.env.CONTENTFUL_API_ACCESS_TOKEN as string,
})
