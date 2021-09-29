import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

import logo from '../public/images/Logo Esteso Negativo WEB.png'
import { getProjects } from '../shared/api';
import RichText from '../shared/ui/RichText';
import styled from 'styled-components'
// @ts-ignore
import { IProject } from '@types/contentful'
import FullScreenVideo from '../entities/FullScreenVideo';
import { useEffect, useState } from 'react'

function Project({ project }: { project: IProject}){
  const { fields: { shortDescription } } = project

  return <RichText data={shortDescription} />
}
import img from '@public/images/coming_soon.jpg'

const BackgroundDiv = styled.div`
  background-image: url(${img.src});
  width: 100vw;
  height: 100vh;
  background-size: cover;
  background-position: center;
`

const Home = ({ items }: { items: IProject[]}) => {
  const [isDesktop, setIsDesktop] = useState(false)
  useEffect(() => {
    setIsDesktop(window.innerWidth > 800)
    window.addEventListener('resize', () => {
      setIsDesktop(window.innerWidth > 800)
    })
    return () => window.removeEventListener('resize', () => {})
  }, [])
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-black">
      <Head>
        <title>Futur Proche</title>
        <meta name="description" content="Futur Proche Productions" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      { isDesktop 
        ? <FullScreenVideo id={'617766691'}/>
        : <BackgroundDiv />
      }
      {/* <Image src={logo} alt="logo"/> */}
    </div>
  )
}

export default Home

export const getStaticProps = async () => {
  const items: IProject[] = await getProjects()
  return {
    props: { items },
  }
}