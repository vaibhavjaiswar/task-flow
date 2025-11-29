import Link from "next/link";
import ProjectList from "./projects-list";
import { Plus } from "@deemlol/next-icons";

export default async function DashboardPage() {
  return (
    <section className="max-w-[1440px] mx-auto side-px py-6">
      <div className="mb-6 flex justify-between items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-semibold">Your Projects</h1>
        <Link
          href="/project/new"
          className="primary-button text-slate-100! no-underline! flex justify-center items-center gap-2"
        >
          <Plus size={16} />
          <span>New Project</span>
        </Link>
      </div>
      <ProjectList />
    </section>
  );
}
