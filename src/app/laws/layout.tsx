import { LawsSidebar } from "@/components/laws-sidebar";
import { getAllLaws } from "@/lib/laws";

export default function LawsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const laws = getAllLaws();

  return (
    <div className="flex flex-1 flex-col md:flex-row">
      <LawsSidebar laws={laws} />
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
