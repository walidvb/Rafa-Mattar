import { IProject } from '../../@types/contentful';
import ProjectTeaser from './ProjectTeaser';



const ProjectList = ({ projects }: { projects: IProject[]}) => {
  return <div className="divide-y-4 divide-gray-400 divide-solid">
    {[...projects, ...projects, ...projects].map((project, i) => <ProjectTeaser
        key={project.sys.id}
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
    )}
  </div>
}

export default ProjectList