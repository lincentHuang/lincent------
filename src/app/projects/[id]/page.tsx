import type { Metadata } from 'next';
import { FrontendShell } from '../../../components/layouts/frontend-shell';
import { Footer } from '../../../components/layouts/footer';
import { ProjectShowcase } from '../../../features/projects/components/project-showcase';
import { getProjectById } from '../../../features/projects/server/queries';

interface PageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const project = await getProjectById(params.id);
  if (!project) {
    return {
      title: 'Project Case Study | Lincent Huang',
    };
  }
  return {
    title: `${project.title} | Lincent Huang`,
    description: project.summary,
  };
}

export default function ProjectDetailPage({ params }: PageProps) {
  const projectId = params.id;

  return (
    <FrontendShell activeProjectId={projectId}>
      <main className="w-full flex-1">
        <ProjectShowcase initialSelectedId={projectId} />
      </main>
      <Footer />
    </FrontendShell>
  );
}
