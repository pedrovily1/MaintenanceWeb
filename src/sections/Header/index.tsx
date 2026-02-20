import { PageHeader } from "@/sections/Header/components/PageHeader";

export const Header = () => {
  return (
    <div className="bg-[var(--panel-2)] border-b border-[var(--border)] shadow-[inset_0_-1px_0_rgba(255,255,255,0.03)] box-border caret-transparent shrink-0 z-10 px-2 lg:px-4 py-2 lg:py-4">
      <PageHeader />
    </div>
  );
};
