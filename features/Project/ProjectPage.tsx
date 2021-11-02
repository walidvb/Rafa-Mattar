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
      production,
      length,
      music,
      countries,
      type,
      festival,
    } } = project
    const [isOpen, setOpen] = useState(false)
    return <Layout>
      <WithPointer onClick={() => setOpen(true)} pointerTitle="See trailer" className="min-h-[35vh] md:min-h-[60vh] relative">
        <Image src={"https:" + headerImage.fields.file.url} alt={headerImage.fields.title} layout="fill" objectFit="cover" />
      </WithPointer>
      { isOpen && <div className="fixed bg-black bg-opacity-40 inset-0" onClick={() => setOpen(false)}>
        <div className="fixed -translate-y-1/2 top-1/2 left-1/2 -translate-x-1/2">
          <ReactPlayer url={videoUrl} controls playing={true} />
        </div>
      </div>}
      <div className="md:grid md:grid-cols-2 mx-auto mt-8 md:mt-12 px-4">
        <div>
          <h1 className="text-4xl mb-8 font-bold">
            {project.fields.title}
          </h1>
          <RichText data={body} />
        </div>
        <div className="flex justify-center">
          <div>
            {length && <h2 className="text-4xl mb-8 font-bold">
              {length}&apos;&apos;
            </h2>
            }
            { production && <div className="mb-0 font-bold">
              Production:&nbsp;
              <span className="text-brand font-bold">
                {production}
              </span>
            </div>}
            { music && <div className="mt-4 mb-0 font-bold">
              Music:&nbsp;
              <span className="text-brand font-bold">
                {music}
              </span>
            </div>}
            { countries && <div className="mt-4 mb-0 font-bold">
              Countries: &nbsp;
              <span className="text-brand font-bold">
                {countries}
              </span>
            </div>}
            { type && <div className="mt-4 mb-0 font-bold">
              Type:&nbsp;
              <span className="text-brand font-bold">
                {type}
              </span>
            </div>}
            { festival && <div className="mt-4 mb-0 font-bold">
              Festivals&nbsp;
              <span className="text-brand font-bold">
                <RichText data={festival} className="text-brand"/>
              </span>
            </div>}
          </div>
        </div>
      </div>
    </Layout>
}

export default ProjectPage