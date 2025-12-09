import Link from "next/link";
import NavBarMenu from "@/components/nav-bar-menu";

export default function NavBar() {
  return (
    <header className="sticky top-0 shadow-lg z-40">
      <nav className="side-px  py-3 bg-slate-800 flex justify-between items-center gap-4">
        <Link
          href="/dashboard"
          className="text-lg text-slate-100! no-underline!"
        >
          Task<strong>Flow</strong>
        </Link>
        <NavBarMenu />
      </nav>
    </header>
  );
}
