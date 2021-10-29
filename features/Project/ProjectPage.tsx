import Layout from '@shared/layout/Layout';
import RichText from '@shared/ui/RichText';
import { IProject } from '../../@types/contentful';
import Image from 'next/image';

const ProjectPage = ({ project, }: { project: IProject }) => {
    const { fields: { 
      body,
      headerImage,
    } } = project
    return <Layout>
      <div className="min-h-[35vh] md:min-h-[60vh] relative">
        <Image src={"https:" + headerImage.fields.file.url} alt={headerImage.fields.title} layout="fill" objectFit="cover" />
      </div>
      <div className="container mx-auto mt-4 md:mt-12 px-4">
        <h1 className="text-4xl mb-8 font-bold">
          {project.fields.title}
        </h1>
        <RichText data={body} />
      </div>
    </Layout>
}

export default ProjectPage