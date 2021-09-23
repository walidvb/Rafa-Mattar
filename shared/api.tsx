import { createClient, EntryCollection } from 'contentful'
import { IProject } from '../@types/contentful.d';

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID as string,
  environment: 'master', // defaults to 'master' if not set
  accessToken: process.env.CONTENTFUL_API_ACCESS_TOKEN as string,
})

export const getProjects = async () => {
  const res = await client.getEntries({
    content_type: 'project',
  })
  const { items } = res as { items: IProject[]}
  return items
}