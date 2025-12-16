import TaskPanel from "./task-panel";

interface Props {
  params: Promise<{ projectId: string; taskId: string }>;
}

export default async function ProjectPage({ params }: Props) {
  const { projectId, taskId } = await params;

  return (
    <section className="min-h-[calc(100dvh-52px-28px)] text-slate-800 bg-white">
      <TaskPanel projectId={projectId} taskId={taskId} />
    </section>
  );
}
