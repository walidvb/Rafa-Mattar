import { useEffect } from 'react';
import { IProject } from '../../@types/contentful';
import ProjectTeaser from './ProjectTeaser';
import { WithPointer } from './WithPointer';


const ProjectList = ({ projects }: { projects: IProject[]}) => {
  return <div id="projets" style={{ scrollMarginTop: "var(--header-height)"}}>
    <WithPointer pointerTitle="Voir le projet">
      {projects.map((project) => (
        <ProjectTeaser
          key={project.sys.id}
          image={project.fields.homeImage}
          title={project.fields.title}
          slug={project.fields.slug}
          layout={project.fields.homeLayout}
          />
      )
        )}
        </WithPointer>
  </div>
}

export default ProjectList