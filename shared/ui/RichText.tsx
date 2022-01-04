import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { Document } from '@contentful/rich-text-types';

export default function RichText({ data, options, className, style }: { data: Document | undefined, className?: string, style?: any, options?: any }){
  if(!data) return null
  return <div className={`prose ${className} whitespace-pre-wrap`} style={style}>
    {documentToReactComponents(data, options)}
  </div>

}