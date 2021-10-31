import { useEffect } from 'react';
import { IProject } from '../../@types/contentful';
import ProjectTeaser from './ProjectTeaser';
import { WithPointer } from './WithPointer';


const ProjectList = ({ projects }: { projects: IProject[]}) => {
  return <div>
    {[...projects, ...projects, ...projects].map((project, i) => <WithPointer pointerTitle="View project" key={project.sys.id}>
      <ProjectTeaser
        image={project.fields.homeImage}
        title={project.fields.title}
        shortDescription={project.fields.shortDescription}
        slug={project.fields.slug}
        layout={(() => {
          if(i % 3 === 0) return 'two columns'
          if(i % 3 === 1) return 'with mask'
          if(i % 3 === 2) return 'full width'
        })()}
        />
    </WithPointer>
    )}
  </div>
}

export default ProjectList