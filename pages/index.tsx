import { getProjects } from '../shared/api';
// @ts-ignore
import { IProject, ISiteSettings } from '../types/contentful'
import HomeScreen from '../features/home/HomeScreen';
import { getSiteSettings } from '@shared/api';
import cookie from "cookie"
import { NextPageContext } from 'next';



const Home = (props: { projects: IProject[], settings: ISiteSettings, isFirstVisit: boolean }) => {
  return <HomeScreen {...props} />
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