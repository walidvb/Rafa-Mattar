import Layout from '@shared/layout/Layout';
import RichText from '@shared/ui/RichText';
import { IProject } from '../../@types/contentful';
import Image from 'next/image';

import { useState } from 'react';
import ReactPlayer from 'react-player'
import { WithPointer } from '../home/WithPointer';

const ProjectPage = ({ project, }: { project: IProject }) => {
    const { fields: { 
      body,
      headerImage,
      videoUrl,
    } } = project
    const [isOpen, setOpen] = useState(false)
    return <Layout>
      <WithPointer onClick={() => setOpen(true)} pointerTitle="See trailer" className="min-h-[35vh] md:min-h-[60vh] relative">
        <Image src={"https:" + headerImage.fields.file.url} alt={headerImage.fields.title} layout="fill" objectFit="cover" />
      </WithPointer>
      <div className="container mx-auto mt-8 md:mt-12 px-4">
        { isOpen && <div className="fixed bg-black bg-opacity-40 inset-0" onClick={() => setOpen(false)}>
          <div className="fixed -translate-y-1/2 top-1/2 left-1/2 -translate-x-1/2">
            <ReactPlayer url={videoUrl} controls playing={true} />
          </div>
        </div>}
        <h1 className="text-4xl mb-8 font-bold">
          {project.fields.title}
        </h1>
        <RichText data={body} />
      </div>
    </Layout>
}

export default ProjectPage