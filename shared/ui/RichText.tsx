import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { Document } from '@contentful/rich-text-types';

export default function RichText({ data, className, style }: { data: Document | undefined, className?: string, style?: any }){
  if(!data) return null
  return <div className={`prose lg:prose-xl ${className}`} style={style}>
    {documentToReactComponents(data)}
  </div>

}