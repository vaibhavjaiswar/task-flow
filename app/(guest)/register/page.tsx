import Link from "next/link";
import RegisterForm from "./form";

export default function RegisterPage() {
  return (
    <main className="w-full min-h-full sm:p-8 bg-linear-150 from-slate-200 to-slate-300 flex flex-col justify-normal sm:justify-center items-center">
      <section className="grow sm:grow-0 w-full sm:max-w-xl md:max-w-2xl px-6 py-16 sm:p-10 sm:pb-6 bg-white rounded-lg shadow-2xl space-y-6 sm:space-y-4">
        <h1 className="text-4xl text-center">
          Task<strong>Flow</strong>
        </h1>

        <p className="-mt-4 text-center font-light">Create your new account</p>

        <RegisterForm />

        <Link href="/login" className="block w-max mx-auto text-sm font-light">
          Already have an account?
        </Link>

        <p className="text-sm mb-1 text-slate-400 text-center font-light">
          &copy; Designed & developed by Vaibhav Jaiswar
        </p>
      </section>
    </main>
  );
}
