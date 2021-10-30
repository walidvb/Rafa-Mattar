import Layout from '@shared/layout/Layout';
import RichText from '@shared/ui/RichText';
import { IProject } from '../../@types/contentful';
import Image from 'next/image';

import ModalVideo from 'react-modal-video';
import { useState } from 'react';
import ReactPlayer from 'react-player'

const Player = ({ videoUrl }: { videoUrl: undefined | string }) => {
  const [isOpen, setOpen] = useState(false)

  if(!videoUrl){ 
    return null
  }
  return (
    <>
      <button className="btn-primary" onClick={() => setOpen(true)}>VIEW TRAILER</button>
      {isOpen && <div>
        <div className="fixed -translate-y-1/2 top-1/2 left-1/2 -translate-x-1/2">
          <ReactPlayer url={videoUrl} controls playing={true}/>
        </div>
      </div>}

    </>
  )
}

const ProjectPage = ({ project, }: { project: IProject }) => {
    const { fields: { 
      body,
      headerImage,
      videoUrl,
    } } = project
    return <Layout>
      <div className="min-h-[35vh] md:min-h-[60vh] relative">
        <Image src={"https:" + headerImage.fields.file.url} alt={headerImage.fields.title} layout="fill" objectFit="cover" />
      </div>
      <div className="container mx-auto mt-8 md:mt-12 px-4">
        <Player videoUrl={videoUrl}/>
        <h1 className="text-4xl mb-8 font-bold">
          {project.fields.title}
        </h1>
        <RichText data={body} />
      </div>
    </Layout>
}

export default ProjectPage