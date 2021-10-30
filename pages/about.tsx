
import { getSiteSettings } from '@shared/api';
import Layout from '@shared/layout/Layout';
import { ISiteSettings } from '../@types/contentful';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

const TeamPage = ({ settings }: { settings: ISiteSettings}) => {
  return <Layout className="items-center flex justify-center mt-20">
    <div className="grid md:grid-cols-2">
      <div className="bg-brand grid place-content-center text-white font-bold text-2xl py-24 md:min-h-[40vh]">
        The Project
      </div>
      <div className="px-4 md:px-8 mt-6 max-w-[70ch]">
        {documentToReactComponents(settings.fields.about)}
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