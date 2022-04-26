
import { getSiteSettings } from '@shared/api';
import Layout from '@shared/layout/Layout';
import { ISiteSettings } from '../@types/contentful';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import Image from 'next/image';
import styled from 'styled-components'
import React from 'react';

const TeamMember = ({ img, name, className = '' }: { img: string, name: string, className?: string }) => {
  return <div className={`flex text-bold items-center justify-center gap-4 md:flex-col ${className}`}>
    <div className="rounded-full">
      <Image src={"https:" + img} alt={name} className="w-16 h-16 md:w-20 md:h-20 rounded-full filter grayscale" width={100} height={100}/>
    </div>
    <div className="md:text-center">{name.split(' ').map(s => <React.Fragment key={s}>{s}<br/></React.Fragment>)}</div>
  </div>
}

const Bleeding = styled.div`
  flex-basis: 100%;
`

const TeamPage = ({ settings }: { settings: ISiteSettings}) => {
  return <Layout className="items-center flex justify-centººxer md:mt-20">
    <Bleeding>
      <div className="container mx-auto flex flex-col md:grid grid-cols-12 gap-4 ">
        <div className="md:col-span-5 min-h-banner md:max-h-[initial] overflow-hidden relative md:aspect-square">
          <Image
            src={"https:" + settings.fields.biographyImage.fields.file.url}
            layout="fill"
            objectFit='cover'
            width={600}
            height={600}
            alt="Biography"
          />
        </div>
        <div className="flex md:flex-col justify-between col-span-2 items-center text-brand md:mx-auto order-1 md:-order-none px-2 md:px-0">
          <TeamMember img={settings.fields.valeriaImage.fields.file.url} name={"Valeria Mazzucchi"} />
          <TeamMember img={settings.fields.antoineImage.fields.file.url} name={"Antoine Harari"} className="flex-row-reverse md:flex-col-reverse text-right" />
        </div>
        <div className="grid bg-brand px-2 py-4 md:px-8 lg:px-16 text-white col-span-5 items-center md:aspect-square">
          {documentToReactComponents(settings.fields.about)}
        </div>
      </div>
    </Bleeding>
  </Layout>
}

export default TeamPage;


export const getStaticProps = async () => {
  const settings = await getSiteSettings();
  return {
    props: { settings },
    revalidate: 60,
  };
};