import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-[1200px] px-6 py-10">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <Link href="/" className="text-lg font-bold text-text-primary">
            ArcSmith<span className="text-accent">.</span>
          </Link>

          <p className="text-xs text-text-muted">
            &copy; {new Date().getFullYear()} ArcSmith Apps. Independent Android apps crafted with care.
          </p>
        </div>
      </div>
    </footer>
  );
}
