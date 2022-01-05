import { createClient } from 'contentful'
import { IProject, ISiteSettings } from '../@types/contentful.d';

const SITE_SETTINGS_ID = '3x1XAGynLaSjkDDBSaBFrl'

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID as string,
  environment: 'master', // defaults to 'master' if not set
  accessToken: process.env.CONTENTFUL_API_ACCESS_TOKEN as string,
})

export const getProjects = async (search = {}) => {
  const res = await client.getEntries({
    content_type: 'project',
    ...search
  })
  const { items: projects } = res as { items: IProject[]}
  return projects
}


export const getSiteSettings = async () => {
  const res = await client.getEntry(SITE_SETTINGS_ID)
  const entry = res as ISiteSettings
  return entry
}