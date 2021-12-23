import { BLOCKS, MARKS } from '@contentful/rich-text-types';

import Layout from '@shared/layout/Layout';
import RichText from '@shared/ui/RichText';
import { IProject } from '../../@types/contentful';
import Image from 'next/image';

import { useState } from 'react';
import ReactPlayer from 'react-player'
import { WithPointer } from '../home/WithPointer';
import { useDesktop } from '../../shared/hooks/useDesktop';

const wrapperClasses = "min-h-[35vh] md:min-h-[60vh] relative"

const ProjectPage = ({ project, }: { project: IProject }) => {
    const isDesktop = useDesktop()
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
    const img = <Image src={"https:" + headerImage.fields.file.url} alt={headerImage.fields.title} layout="fill" objectFit="cover" />

  const videoHeader = (() => {
    const header = <WithPointer onClick={() => setOpen(true)} pointerTitle="Voir la bande-annonce" className={wrapperClasses}>
      {img}
      <div className="md:hidden absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-16 w-16 bg-white rounded-full border-2 border-red-500 p-3">
        <Image src={require('/public/images/play.png')} alt="play" layout="responsive" objectFit='cover'/>
      </div>
    </WithPointer> 
    if(isDesktop) return header
    if(!isOpen) return header

    return (<div className="w-full relative bg-blue">
      <div className="pb-[56.25%] w-full bg-red">
        <ReactPlayer className="absolute" width="100%" height="100%" url={videoUrl} controls playing={true} />
      </div>
    </div>)
  })()
    return <Layout>
        {videoUrl ?
          videoHeader:
          <div className={wrapperClasses}>
            {img}
          </div>
        }

      { isDesktop && isOpen && videoUrl && <div className="fixed bg-black bg-opacity-40 inset-0" onClick={() => setOpen(false)}>
        <div className="fixed -translate-y-1/2 top-1/2 left-1/2 -translate-x-1/2 w-[70vw] bg-blue">
          <div className="pb-[56.25%] w-full bg-red">
            <ReactPlayer className="absolute" width="100%" height="100%" url={videoUrl} controls playing={true} />
          </div>
        </div>
      </div>}
      <div className="md:grid md:grid-cols-[7fr,5fr] lg:grid-cols-[8fr,4fr] gap-8 mt-8 md:mt-12 container mx-auto px-4 md:px-0">
        <div>
          <h1 className="text-4xl mb-8 font-bold">
            {project.fields.title}
          </h1>
          <RichText data={body} />
        </div>
        <div className="mt-12 md:mt-0">
          <div>
            {length && <h2 className="text-4xl mb-8 font-bold">
              {length}&apos;&apos;
            </h2>
            }
            <div className="grid grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-4">
              {production && <div className="">
                <div className="text-brand font-bold">Production:&nbsp;</div>
                <span className="">
                  {production}
                </span>
              </div>}
              {music && <div className="">
                <div className="text-brand font-bold">Musique:&nbsp;</div>
                <span className="">
                  {music}
                </span>
              </div>}
              {countries && <div className="">
                <div className="text-brand font-bold">Pays: &nbsp;</div>
                <span className="">
                  {countries}
                </span>
              </div>}
              {type && <div className="">
                <div className="text-brand font-bold">Type:&nbsp;</div>
                <span className="">
                  {type}
                </span>
              </div>}
              {festival && <div className="col-span-2">
                <div className="text-brand font-bold">Festivals&nbsp;</div>
                <span className="">
                  <RichText data={festival} options={options} />
                </span>
              </div>}
            </div>
          </div>
        </div>
      </div>
    </Layout>
}

export default ProjectPage

const options = {
  renderMark: {
    [MARKS.UNDERLINE]: (text: string) => <span className="text- ">{text}</span>,
  },
  // renderNode: {
  //   [BLOCKS.PARAGRAPH]: (node: any, next: any) => <p>{next(node.content).replace(/\n/g, `</br>`)}</p>
  // }
};