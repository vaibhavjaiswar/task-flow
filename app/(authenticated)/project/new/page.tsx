import NewProjectForm from "./form";

export default function CreateNewProjectPage() {
  return (
    <section className="max-w-7xl mx-auto side-px py-6 text-slate-800 bg-slate-100">
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold">
          Create New Project
        </h1>
        <p className="mt-1 font-light">
          Fill out the details below to start a new project.
        </p>
      </div>
      <NewProjectForm />
    </section>
  );
}
