// @ts-ignore
import { IProject } from "../../types/contentful";
import Image from 'next/image';
import Link from 'next/link';
import { WithPointer } from '../home/WithPointer';

const Item = ({ project }: { project: IProject}) => {
  return <Link href={`/${project.fields.slug}`}>
      <a className="grid grid-cols-2 md:grid-cols-3 gap-4 items-center ">
        <WithPointer className="md:col-span-2" pointerTitle="Entrer">
          <Image src={"https:" + project.fields.headerImage.fields.file.url} alt={project.fields.headerImage.fields.title} layout="responsive" width={500} height={300}/>
        </WithPointer>
        <h3 className="md:cols-span-1 text-2xl font-bold hover:text-brand flex items-center h-full">{project.fields.title}</h3>
      </a>
    </Link>
}

export const Related = ({ projects }: { projects: IProject[]}) => {
  return <div className="container mx-auto">
    <h2 className="text-3xl md:text-6xl font-bold mb-8 md:mb-16 pl-4 md:pl-0">Voir Aussi</h2>
    <div className="container mx-auto grid md:grid-cols-2 gap-4">
      {projects.map(project => <Item key={project.sys.id} project={project} />)}
    </div>
  </div>;
};
