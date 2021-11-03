import { BLOCKS, MARKS } from '@contentful/rich-text-types';

import Layout from '@shared/layout/Layout';
import RichText from '@shared/ui/RichText';
import { IProject } from '../../@types/contentful';
import Image from 'next/image';

import { useState } from 'react';
import ReactPlayer from 'react-player'
import { WithPointer } from '../home/WithPointer';

const wrapperClasses = "min-h-[35vh] md:min-h-[60vh] relative"

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
    console.log(festival)
    const [isOpen, setOpen] = useState(false)
    const img = <Image src={"https:" + headerImage.fields.file.url} alt={headerImage.fields.title} layout="fill" objectFit="cover" />
    return <Layout>
        {videoUrl ? 
          <WithPointer onClick={() => setOpen(true)} pointerTitle="See trailer" className={wrapperClasses}>
            {img}
          </WithPointer> :
          <div className={wrapperClasses}>
            {img}
          </div>
        }
      { isOpen && videoUrl && <div className="fixed bg-black bg-opacity-40 inset-0" onClick={() => setOpen(false)}>
        <div className="fixed -translate-y-1/2 top-1/2 left-1/2 -translate-x-1/2">
          <ReactPlayer url={videoUrl} controls playing={true} />
        </div>
      </div>}
      <div className="md:grid md:grid-cols-2 gap-8 mx-auto mt-8 md:mt-12 px-4">
        <div>
          <h1 className="text-4xl mb-8 font-bold">
            {project.fields.title}
          </h1>
          <RichText data={body} />
        </div>
        <div className="flex justify-center mt-12 md:mt-0">
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
              <span className="font-bold">
                <RichText data={festival} options={options} />
              </span>
            </div>}
          </div>
        </div>
      </div>
    </Layout>
}

export default ProjectPage

const options = {
  renderMark: {
    [MARKS.UNDERLINE]: (text: string) => <span className="text-brand">{text}</span>,
  },
  // renderNode: {
  //   [BLOCKS.PARAGRAPH]: (node: any, next: any) => <p>{next(node.content).replace(/\n/g, `</br>`)}</p>
  // }
};