import Head from 'next/head'
import { getProjects } from '../shared/api';
import RichText from '../shared/ui/RichText';
import styled from 'styled-components'
// @ts-ignore
import { IProject } from '@types/contentful'

function Project({ project }: { project: IProject}){
  const { fields: { shortDescription } } = project

  return <RichText data={shortDescription} />
}
import img from '@public/images/coming_soon.jpg'
import Header from '../shared/layout/Header';
import Layout from '@shared/layout/Layout'
import ProjectList from '../features/home/ProjectList';

const Slide = styled.div`
  width: 100vw;
  height: 100vh;
`

const Intro = () => {
  return <Slide className="grid place-content-center md:grid-cols-[70ch] px-4 min-h-full">
    <div className="font-serif text-3xl md:text-6xl font-bold">
      Ma allora io le potrei dire anche con il rispetto per l&apos;autorità, che anche soltanto le due cose come vice-sindaco, capisce? Non si intrometta!
    </div>
  </Slide>
}

const Outro = () => {
  return <Slide className="grid place-content-center px-4 min-h-full text-center">
    <div className="text-4xl">
      Antoine Harari / Valeria Mazzucchi
    </div>
    <div className="text-gray-400 mt-6">
      Founders of Futur Proche
    </div>
  </Slide>
}

const Home = ({ items }: { items: IProject[]}) => {

  return (
    <Layout>
      <Head>
        <title>Futur Proche</title>
        <meta name="description" content="Futur Proche Productions" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Intro />
      <ProjectList />
      <Outro />
    </Layout>
  )
}

export default Home

export const getStaticProps = async () => {
  const items: IProject[] = await getProjects()
  return {
    props: { items },
  }
}