
import { getSiteSettings } from '@shared/api';
import Layout from '@shared/layout/Layout';
import RichText from '@shared/ui/RichText';
import { ISiteSettings } from '@types/contentful';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import Image from 'next/image';

const TeamPage = ({ settings }: { settings: ISiteSettings}) => {
  console.log(settings)
  return <Layout className="flex flex-col min-h-screen">
    <div className="flex-grow relative">
      <Image 
        src={'https:' + settings.fields.biographyImage.fields.file.url} 
        alt={settings.fields.biographyImage.fields.title}
        layout="fill"
        objectFit="cover"
      />
    </div>
    <div className="grid grid-cols-2 py-8 px-4 bg-red-500 text-white items-center gap-4">
      <div className="grid grid-cols-2 items-center">
        <h1 className="text-4xl font-bold mx-auto">Antoine<br />Harari</h1>
        <div>
          {documentToReactComponents(settings.fields.antoineBio)}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 items-center">
        <h1 className="text-4xl font-bold text-right mx-auto order-1">Valeria<br />Mazucchi</h1>
        <div className="text-right">
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