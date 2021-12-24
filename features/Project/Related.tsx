import { IProject } from "../../types/contentful";
import Image from 'next/image';

const Item = ({ project }: { project: IProject}) => {
  return <div className="grid grid-cols-3 gap-4 items-center">
    <div className="col-span-2">
      <Image src={"https:" + project.fields.headerImage.fields.file.url} alt={project.fields.headerImage.fields.title} layout="responsive" width={500} height={300}/>
    </div>
    <h3 className="cols-span-1 text-2xl font-bold ">{project.fields.title}</h3>
  </div>
}

export const Related = ({ projects }: { projects: IProject[]}) => {
  return <div className="container mx-auto">
    <h2 className="text-3xl md:text-6xl font-bold mb-8 md:mb-16">Voir Aussi</h2>
    <div className="container mx-auto grid grid-cols-2 gap-4">
      {projects.map(project => <Item key={project.sys.id} project={project} />)}
    </div>
  </div>;
};
