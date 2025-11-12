import Link from "next/link";
import { Folder, Tool, Users } from "@deemlol/next-icons";

export default function IndexPage() {
  return (
    <main className="w-full min-h-full sm:p-8 bg-linear-150 from-slate-200 to-slate-300 flex flex-col justify-normal sm:justify-center items-center">
      <section className="grow sm:grow-0 w-full sm:max-w-xl md:max-w-2xl px-6 py-16 sm:p-10 sm:pb-6 bg-white rounded-lg shadow-2xl space-y-8 sm:space-y-4">
        <h1 className="text-5xl text-center font-light">
          Welcome to{" "}
          <span className="text-slate-800 font-semibold rounded-lg">
            TaskFlow
          </span>
        </h1>

        <p className="-mt-2 text-center font-light">
          Plan, track, and deliver.
        </p>
        <p className="text-sm text-center font-light">
          A lightweight task management platform designed for teams who value
          simplicity, clarity, and productivity.
        </p>

        <ul className="w-auto sm:w-max mx-auto text-sm font-light space-y-2">
          <li className="flex justify-center items-start sm:items-center gap-2">
            <Folder size={20} className="text-slate-800" />
            <span>Organize projects, sprints and tasks</span>
          </li>
          <li className="flex justify-center items-start sm:items-center gap-2">
            <Users size={20} className="text-slate-800" />
            <span>Collaborate seamlessly with your team</span>
          </li>
          <li className="flex justify-center items-start sm:items-center gap-2">
            <Tool size={20} className="text-slate-800" />
            <span>Customize workflows to match your goals</span>
          </li>
        </ul>

        <div className="max-w-md mx-auto flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
          <Link
            href="/login"
            className="flex-1 primary-button w-full sm:w-auto text-center hover:text-slate-100! no-underline!"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="flex-1 secondary-button w-full sm:w-auto text-center hover:text-slate-800! no-underline!"
          >
            Create account
          </Link>
        </div>

        <p className="text-sm text-slate-400 text-center font-light">
          &copy; Designed & developed by Vaibhav Jaiswar
        </p>
      </section>
    </main>
  );
}
