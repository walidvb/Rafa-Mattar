
import { Asset } from 'contentful';
import { IProjectFields } from '../../../@types/contentful.d';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useCallback } from 'react';
import { useIntersection } from './IntersectionObserver';
import RichText from '@shared/ui/RichText';
import { Document } from '@contentful/rich-text-types';


type IProps = { image: Asset, title: string, shortDescription: Document };

const TwoCol = ({ image, title, shortDescription }: IProps) => {
  const [opacity, setOpacity] = useState(0)
  const onRatioChange = useCallback((percentage) => {
    setOpacity(map(percentage, 0.7, .9, 0, 1))
  }, [setOpacity])

  const ref = useIntersection({ callback: onRatioChange })


  console.log(opacity)
  return <div ref={ref} className="min-h-screen min-w-screen grid grid-rows-2 md:grid-rows-1 md:grid-cols-2">
    <div className="grid place-content-center text-4xl relative">
      <RichText data={shortDescription} style={{ opacity: opacity }} />
      <div
        style={{ opacity: 1 - opacity*2}}
        className="absolute -translate-y-1/2 top-1/2 left-0 right-0 text-center"
      >
        {title}
      </div>
    </div>
    <div className="relative">
      <Image src={`https:${image.fields.file.url}`} alt={title} layout='fill' objectFit="cover" />
    </div>
  </div>
}

const ProjectTeaser = ({ layout, slug, ...props }: IProps & { slug: string, layout?: IProjectFields['homeLayout'] }) => {
  const teaser = (() => {
    if(layout === 'two columns'){
      return <TwoCol {...props} />
    }
    return <TwoCol {...props} />
  })()

  return <Link href={`${slug}`}>
    <a className="hover:text-brand">
      {teaser}
    </a>
  </Link>
}

export default ProjectTeaser

function map(num: number, in_min: number, in_max: number, out_min: number, out_max: number) {
  return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}