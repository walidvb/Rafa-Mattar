import Layout from '@shared/layout/Layout';
// @ts-ignore
import { IProject, ISiteSettings } from '../..types/contentful';
import Head from 'next/head';
import styled from 'styled-components';
import RichText from '../../shared/ui/RichText';
import ProjectList from './ProjectList';
import Link from 'next/link';
import { Document } from '@contentful/rich-text-types';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { Outro } from './Outro';



export const Slide = styled.div`
  width: 100vw;
  min-height: 100vh;
  @media (min-width: 768px) {
    min-height: 100vh;
  }
`

const Intro = ({ textData }: { textData: Document}) => {
  return <Slide className="grid place-content-center mt-4 lg:grid-cols-[70ch] px-4 min-h-screen-header">
    <Link href="/about">
      <a className="hover:text-brand">
        <div className="text-3xl md:text-6xl font-bold md:leading-[1.2em]">
          {documentToReactComponents(textData)}
        </div>
      </a>
    </Link>
  </Slide>
}

const HomeScreen = ({ projects, settings }: { projects: IProject[], settings: ISiteSettings }) => {
  console.log(projects)
  return (
    <Layout>
      <Head>
        <title>Futur Proche</title>
        <meta name="description" content="Futur Proche Productions" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Intro textData={settings.fields.introText}/>
      <ProjectList projects={projects} />
      <Outro />
    </Layout>
  )
}

export default HomeScreen