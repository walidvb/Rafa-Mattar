import Layout from '@shared/layout/Layout';
// @ts-ignore
import { IProject, ISiteSettings } from '@types/contentful';
import Head from 'next/head';
import styled from 'styled-components';
import RichText from '../../shared/ui/RichText';
import ProjectList from './ProjectList';
import Link from 'next/link';
import { Document } from '@contentful/rich-text-types';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';


function Project({ project, settings }: { project: IProject, settings: ISiteSettings }) {
  const { fields: { shortDescription } } = project
  return <RichText data={shortDescription} />
}

const Slide = styled.div`
  width: 100vw;
  height: 100vh;
`

const Intro = ({ textData }: { textData: Document}) => {
  return <Slide className="grid place-content-center md:grid-cols-[70ch] px-4 min-h-full">
    <Link href="/about">
      <a className="hover:text-brand">
        <div className="font-serif text-3xl md:text-6xl font-bold md:leading-[1.2em]">
          {documentToReactComponents(textData)}
        </div>
      </a>
    </Link>
  </Slide>
}

const Outro = () => {
  return <Slide className="grid place-content-center px-4 min-h-full text-center">
    <Link href="/team">
      <a className="text-4xl" >
        Antoine Harari / Valeria Mazzucchi
      </a>
    </Link>
    <div className="text-gray-400 mt-6">
      Founders of Futur Proche
    </div>
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