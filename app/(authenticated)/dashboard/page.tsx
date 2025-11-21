import Link from "next/link";
import { Plus } from "@deemlol/next-icons";

export default function DashboardPage() {
  return (
    <section className="max-w-7xl mx-auto side-px py-6">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {projects.map(({ id, name, owner, tasks }) => {
          const { done, inprogress, todo, total } = tasks;
          return (
            <div
              key={id}
              className="p-6 bg-white border border-slate-100 rounded-md shadow-md hover:shadow-lg transition-shadow"
            >
              <h2
                className="mb-2 text-2xl font-semibold text-slate-800 line-clamp-1"
                title={name}
              >
                {name}
              </h2>
              <p className="mb-3 text-sm text-slate-600">
                <strong>Owner:</strong> {owner}
              </p>
              <div className="space-y-1">
                <p className="text-sm text-slate-600">
                  <strong>Total:</strong> {total} task(s)
                </p>
                <p className="text-sm text-slate-600">
                  <strong>Done:</strong> {done}
                </p>
                <p className="text-sm text-slate-600">
                  <strong>In Progress:</strong> {inprogress}
                </p>
                <p className="text-sm text-slate-600">
                  <strong>To Do:</strong> {todo}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

const projects = [
  {
    id: 1,
    name: "Website Redesign",
    owner: "Jane Doe",
    tasks: {
      done: 10,
      inprogress: 12,
      todo: 8,
      total: 30,
    },
  },
  {
    id: 2,
    name: "Mobile Application Development",
    owner: "John Smith",
    tasks: {
      done: 5,
      inprogress: 3,
      todo: 2,
      total: 10,
    },
  },
  {
    id: 3,
    name: "E-commerce Setup",
    owner: "Alice Johnson",
    tasks: {
      done: 2,
      inprogress: 1,
      todo: 2,
      total: 5,
    },
  },
];
