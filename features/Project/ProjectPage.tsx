import Layout from '@shared/layout/Layout';
import RichText from '@shared/ui/RichText';
import { IProject } from '../../@types/contentful';
import Image from 'next/image';

const ProjectPage = ({ project, }: { project: IProject }) => {
    const { fields: { 
      shortDescription,
      headerImage,
    } } = project
    return <Layout>
      <div className="min-h-[60vh] relative">
        <Image src={"https:" + headerImage.fields.file.url} alt={headerImage.fields.title} layout="fill" objectFit="cover" />
      </div>
      <div className="container mx-auto mt-4 md:mt-10">
        <h1 className="text-2xl">
          {project.fields.title}
        </h1>
        <RichText data={shortDescription} />
      </div>
    </Layout>
}

export default ProjectPage