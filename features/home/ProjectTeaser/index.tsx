
import { Asset } from 'contentful';
import { IProjectFields } from '../../../@types/contentful.d';
import Link from 'next/link';
import { Document } from '@contentful/rich-text-types';
import { TwoCol } from './TwoCol';
import { WithMask } from './WithMask';


export type IProps = { image: Asset, title: string, shortDescription: Document | undefined };



const ProjectTeaser = ({ layout, slug, ...props }: IProps & { slug: string, layout?: IProjectFields['homeLayout'] }) => {
  const teaser = (() => {
    if(layout === 'two columns'){
      return <TwoCol {...props} />
    }
    if(layout === 'with mask'){
      return <WithMask {...props} />
    }
    if(layout === 'full width'){
      return <WithMask {...props} />
    }
  })()

  return <Link href={`${slug}`}>
    <a className="hover:text-brand">
      {teaser}
    </a>
  </Link>
}

export default ProjectTeaser