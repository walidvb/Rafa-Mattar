import { IProject } from '@types/contentful';
import ProjectTeaser from './ProjectTeaser';



const ProjectList = ({ projects }: { projects: IProject[]}) => {
  return <div>
    {projects.map(project => <ProjectTeaser key={project.sys.id} image={project.fields.homeImage} title={project.fields.title} />)}
  </div>
}

export default ProjectList