
import { Asset } from 'contentful';
import { IProjectFields } from '../../../@types/contentful.d';
import Image from 'next/image';
import Link from 'next/link';

type IProps = { image: Asset, title: string };

const TwoCol = ({ image, title }: IProps) => {
  return <div className="min-h-screen min-w-screen grid grid-rows-2 md:grid-rows-1 md:grid-cols-2">
    <div className="grid place-content-center text-4xl">
      {title}
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