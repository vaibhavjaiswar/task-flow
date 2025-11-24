import ProjectPanel from "./project-panel";

interface Props {
  params: Promise<{ projectId: string }>;
}

export default async function ProjectPage({ params }: Props) {
  const { projectId } = await params;

  return (
    <section className="min-h-[calc(100dvh-52px-28px)] text-slate-800 bg-white">
      <ProjectPanel projectId={projectId} />
    </section>
  );
}
