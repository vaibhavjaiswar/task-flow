import NewProjectForm from "./form";

export default function CreateNewProjectPage() {
  return (
    <section className="min-h-[calc(100dvh-52px-28px)] text-slate-800 bg-white">
      <div className="max-w-7xl mx-auto side-px py-6">
        <div className="mb-4">
          <h1 className="text-2xl sm:text-3xl font-semibold">
            Create New Project
          </h1>
          <p className="mt-1 font-light">
            Fill out the details below to start a new project.
          </p>
        </div>
        <NewProjectForm />
      </div>
    </section>
  );
}
