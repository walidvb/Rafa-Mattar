import Head from 'next/head'
import { getProjects } from '../shared/api';
import RichText from '../shared/ui/RichText';
import styled from 'styled-components'
// @ts-ignore
import { IProject } from '@types/contentful'
import HomeScreen from '../features/home/HomeScreen';



const Home = (props: { projects: IProject[]}) => {
  return <HomeScreen {...props} />
}

export default Home

export const getStaticProps = async () => {
  const projects: IProject[] = await getProjects()
  console.log("projs", projects)
  return {
    props: { projects },
  }
}