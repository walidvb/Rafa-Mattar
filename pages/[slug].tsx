// @ts-ignore
import { IProject } from '../types/contentful';
import ProjectPage from '../features/Project/ProjectPage';
import { getProjects } from '../shared/api';



const Project = (props: { project: IProject }) => {
  return <ProjectPage {...props} />
}

export default Project

// export const getStaticPaths = async () => {
//   const projects = await getProjects()
//   const paths = projects.map(project => '/' + project.fields.slug)
//   return { paths, fallback: false }
// }

export const getServerSideProps = async ({ params }: { params: any }) => {
  const projects = await getProjects({ "fields.slug": params.slug })
  const project: IProject = projects[0]
  return {
    props: { project },
    revalidate: 1,
  }
}