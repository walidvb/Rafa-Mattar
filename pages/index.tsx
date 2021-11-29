import { getProjects } from '../shared/api';
// @ts-ignore
import { IProject, ISiteSettings } from '../types/contentful'
import HomeScreen from '../features/home/HomeScreen';
import { getSiteSettings } from '@shared/api';



const Home = (props: { projects: IProject[], settings: ISiteSettings }) => {
  return <HomeScreen {...props} />
}

export default Home

export const getServerSideProps = async () => {
  const projects: IProject[] = await getProjects()
  const settings = await getSiteSettings()
  return {
    props: { projects, settings, revalidate: 1, },
  }
}