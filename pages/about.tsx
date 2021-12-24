
import { getSiteSettings } from '@shared/api';
import Layout from '@shared/layout/Layout';
import { ISiteSettings } from '../@types/contentful';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import Image from 'next/image';
import styled from 'styled-components'
import React from 'react';

const TeamMember = ({ img, name, className }: { img: string, name: string, className?: string }) => {
  return <div className={`flex text-bold items-center justify-center gap-4 ${className}`}>
    <div className="rounded-full">
      <Image src={"https:" + img} alt={name} className="w-16 h-16 rounded-full" width={100} height={100}/>
    </div>
    <div>{name.split(' ').map(s => <React.Fragment key={s}>{s}<br/></React.Fragment>)}</div>
  </div>
}

const Bleeding = styled.div`
  background: linear-gradient(to right, transparent 0%, transparent 50%, var(--brand-color) 51%, var(--brand-color) 100%);
  flex-basis: 100%;
`

const TeamPage = ({ settings }: { settings: ISiteSettings}) => {
  return <Layout className="items-center flex justify-center md:mt-20">
    <Bleeding>
      <div className="container mx-auto md:grid grid-cols-12 gap-4 ">
        <div className="col-span-5 max-h-[35vh] md:max-h-[initial] overflow-hidden">
          <Image src={"https:" + settings.fields.biographyImage.fields.file.url} layout="responsive" width={600} height={600} alt="Biography"/>
        </div>
        <div className="grid md:grid-cols-5 bg-brand px-2 md:px-0 gap-y-12 text-white col-span-7 py-8">
          <div className="col-span-5 col-start-2">
            {documentToReactComponents(settings.fields.about)}
          </div>
          <div className="flex justify-between col-span-5 col-start-2 items-end">
            <TeamMember img={settings.fields.valeriaImage.fields.file.url} name={"Valeria Mazzucchi"} />
            <TeamMember img={settings.fields.antoineImage.fields.file.url} name={"Antoine Harari"} className="flex-row-reverse text-right" />
          </div>
        </div>
      </div>
    </Bleeding>
  </Layout>
}

export default TeamPage;


export const getStaticProps = async () => {
  const settings = await getSiteSettings()
  return {
    props: { settings },
  }
}