import Link from "next/link";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-bg-primary/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between px-6">
        <Link href="/" className="text-lg font-bold text-text-primary">
          ArcSmith<span className="text-accent">.</span>
        </Link>
      </div>
    </header>
  );
}
