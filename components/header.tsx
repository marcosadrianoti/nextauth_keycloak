import Link from "next/link";
import { SignOutButton } from "./sign-out-button";
import { getServerSession } from "next-auth";

export default async function Header() {
  const session = await getServerSession();
  return (
    <header className="fixed w-full h-20 flex items-center bg-amber-950 text-slate-50">
      <nav className="w-full flex items-center justify-between m-auto max-w-screen-xl">
        <Link href="/">Logo</Link>
        <ul className="flex items-center gap-10">
          <li><Link href="/">Início</Link></li>
          <li><Link href="/public">Público</Link></li>
          <li><Link href="/private">Privado</Link></li>
          {session && <li><SignOutButton/></li>}
        </ul>
      </nav>
    </header>
  );
}
