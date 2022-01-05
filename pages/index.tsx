import { getProjects } from '../shared/api';
// @ts-ignore
import { IProject, ISiteSettings } from '../types/contentful'
import HomeScreen from '../features/home/HomeScreen';
import { getSiteSettings } from '@shared/api';
import cookie from "cookie"
import { NextPageContext } from 'next';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import OGTags from '@shared/layout/OGTags';
import { decode } from 'html-entities';



const Home = (props: { projects: IProject[], settings: ISiteSettings, isFirstVisit: boolean }) => {
  const descAsString = documentToHtmlString(props.settings.fields.introText).replace(/(<([^>]+)>)/gi, "")
  console.log(decode(descAsString))
  return <>
    <OGTags description={decode(descAsString)} />
    <HomeScreen {...props} />
  </>
}

export default Home

export const getServerSideProps = async ({ req }: NextPageContext) => {
  const projects: IProject[] = await getProjects()
  
  const settings = await getSiteSettings()
  const data = cookie.parse(req ? req.headers.cookie || "" : document.cookie)
  const isFirstVisit = JSON.parse(data.futurproche || "{}")?.isFirstVisit ?? true
  return {
    props: { projects, settings, revalidate: 1, isFirstVisit },
  }
}