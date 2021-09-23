import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

import logo from '../public/images/Logo Esteso Negativo WEB.png'
import { getEntries } from '../shared/api';
import RichText from '../shared/ui/RichText';
// @ts-ignore
import { IProject } from '@types/contentful'

function Project({ project }: { project: IProject}){
  const { fields: { shortDescription } } = project

  return <RichText data={shortDescription} />
}

const Home = ({ items }: { items: IProject[]}) => {
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <Head>
        <title>Futur Proche</title>
        <meta name="description" content="Futur Proche Productions" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Image src={logo} alt="logo"/>
    </div>
  )
}

export default Home

export const getStaticProps = async () => {
  const items: IProject[] = await getEntries()
  return {
    props: { items },
  }
}