// @ts-ignore
import { IProject } from '../types/contentful';
import ProjectPage from '../features/Project/ProjectPage';
import { getProjects } from '../shared/api';
import OGTags from '../shared/layout/OGTags';



const Project = (props: { project: IProject, related: IProject[] }) => {
  return <>
    <OGTags
      image={props.project.headerImage.fields.file.url}
      description={props.project.ogDescription}
      path={props.project.slug}
    />
    <ProjectPage {...props} />
  </>
}

export default Project

// export const getStaticPaths = async () => {
//   const projects = await getProjects()
//   const paths = projects.map(project => '/' + project.fields.slug)
//   return { paths, fallback: false }
// }

export const getServerSideProps = async ({ params }: { params: any }) => {
  const projects = await getProjects()
  const project: IProject = projects.find(project => project.fields.slug === params.slug)
  const related = projects.filter(project => project.fields.slug !== params.slug)
  return {
    props: { project, related, projects },
  }
}