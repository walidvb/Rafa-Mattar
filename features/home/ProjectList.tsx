import { useEffect } from 'react';
import { IProject } from '../../@types/contentful';
import ProjectTeaser from './ProjectTeaser';
import { WithPointer } from './WithPointer';


const ProjectList = ({ projects }: { projects: IProject[]}) => {
  return <div>
    {projects.map((project) => <WithPointer pointerTitle="Voir le projet" key={project.sys.id}>
      <ProjectTeaser
        image={project.fields.homeImage}
        title={project.fields.title}
        shortDescription={project.fields.shortDescription}
        slug={project.fields.slug}
        layout={project.fields.homeLayout}
        />
    </WithPointer>
    )}
  </div>
}

export default ProjectList