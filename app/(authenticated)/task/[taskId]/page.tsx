import TaskPanel from "./task-panel";

interface Props {
  params: Promise<{ taskId: string }>;
}

export default async function ProjectPage({ params }: Props) {
  const { taskId } = await params;

  return (
    <section className="min-h-[calc(100dvh-52px-28px)] text-slate-800 bg-white">
      <TaskPanel taskId={taskId} />
    </section>
  );
}
