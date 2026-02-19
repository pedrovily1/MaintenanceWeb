import { PageHeader } from "@/sections/Header/components/PageHeader";

export const Header = () => {
  return (
    <div className="bg-[var(--panel-2)] border-b border-[var(--border)] box-border caret-transparent shrink-0 z-10 px-2 lg:px-4 py-3 lg:py-5">
      <PageHeader />
    </div>
  );
};
