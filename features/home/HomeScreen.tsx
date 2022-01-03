import Layout from '@shared/layout/Layout';
// @ts-ignore
import { IProject, ISiteSettings } from '../..types/contentful';
import Head from 'next/head';
import styled from 'styled-components';
import ProjectList from './ProjectList';
import { Document } from '@contentful/rich-text-types';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import FullScreenVideo from '@entities/FullScreenVideo';
import { useState, useEffect } from 'react';
import { WithPointer } from './WithPointer';
import { useCookies } from "react-cookie"
import { Activity } from './Activity';



export const Slide = styled.div`
  width: 100vw;
  min-height: 100vh;
  @media (min-width: 768px) {
    min-height: 100vh;
  }
`

const Intro = ({ textData }: { textData: Document}) => {
  return <Slide className="grid place-content-center mt-4 lg:grid-cols-[70ch] px-4 min-h-screen-header">
      <div className="hover:text-brand text-3xl md:text-6xl font-bold md:leading-[1.2em] sticky top-[40%] md:py-20">
        {documentToReactComponents(textData)}
      </div>
  </Slide>
}


const HomeScreen = ({ projects, settings, isFirstVisit }: { projects: IProject[], settings: ISiteSettings, isFirstVisit: boolean }) => {
  const [isVisible, setIsVisible] = useState(isFirstVisit)
  const [, setCookie] = useCookies(["futurproche"])

  useEffect(() => {
    setCookie("futurproche", JSON.stringify({ isFirstVisit: false }), {
      path: "/",
      maxAge: 3600, // Expires after 1hr
      sameSite: true,
    })
  }, [setCookie])

  if(isVisible){
    return <WithPointer onClick={() => setIsVisible(false)} pointerTitle="Entrer">
      <FullScreenVideo src={settings.fields.homeVideo} imgSrc={settings.fields.homeImage?.fields.file.url}/>  
    </WithPointer>
  }

  return (
    <Layout fullLogo>
      <Head>
        <title>Futur Proche</title>
        <meta name="description" content="Futur Proche Productions" />
        <link rel="icon" href="/favicon.png" />
      </Head>
        <Intro textData={settings.fields.introText}/>
        <ProjectList projects={projects} />
        <Activity />
    </Layout>
  )
}

export default HomeScreen