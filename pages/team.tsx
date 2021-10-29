
import { getSiteSettings } from '@shared/api';
import Layout from '@shared/layout/Layout';
import RichText from '@shared/ui/RichText';
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
    <div className="grid gap-8 md:grid-cols-2 py-8 px-4 bg-red-500 text-white items-center">
      <div className="grid gap-4 md:grid-cols-2 items-center">
        <h1 className="text-2xl md:text-4xl font-bold md:mx-auto">Antoine <br className="hidden md_block" />Harari</h1>
        <div>
          {documentToReactComponents(settings.fields.antoineBio)}
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 items-center md:text-right">
        <h1 className="text-2xl md:text-4xl font-bold md:mx-auto md:order-1">Valeria <br className="hidden md_block" />Mazucchi</h1>
        <div>
          {documentToReactComponents(settings.fields.valeriaBio)}
        </div>
      </div>
    </div>
  </Layout>
}

export default TeamPage;


export const getStaticProps = async () => {
  const settings = await getSiteSettings()
  return {
    props: { settings },
  }
}