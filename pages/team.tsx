
import { getSiteSettings } from '@shared/api';
import Layout from '@shared/layout/Layout';
import { ISiteSettings } from '../@types/contentful';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import Image from 'next/image';

const TeamPage = ({ settings }: { settings: ISiteSettings}) => {
  console.log(settings)
  return <Layout className="flex flex-col min-h-screen-header">
    <div className="flex-grow relative min-h-[30vh]">
      <Image 
        src={'https:' + settings.fields.biographyImage.fields.file.url} 
        alt={settings.fields.biographyImage.fields.title}
        layout="fill"
        objectFit="cover"
      />
    </div>
    <div className=" bg-brand text-white ">
      <div className="container grid gap-8 md:grid-cols-2 py-8 px-4 lg:items-center mx-auto">
        <div className="grid gap-4">
          <h1 className="text-2xl md:text-4xl font-bold">Antoine Harari</h1>
          <div>
            {documentToReactComponents(settings.fields.antoineBio)}
          </div>
        </div>
        <div className="grid gap-4">
          <h1 className="text-2xl md:text-4xl font-bold">Valeria Mazzucchi</h1>
          <div>
            {documentToReactComponents(settings.fields.valeriaBio)}
          </div>
        </div>
      </div>
    </div>
  </Layout>
}

export default TeamPage;


export const getServerSideProps = async () => {
  const settings = await getSiteSettings()
  return {
    props: { 
      settings, 
      revalidate: 1,
    },
  }
}