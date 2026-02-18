import { useProcedureCount } from '@/store/useProcedureStore';

interface ProceduresNavBadgeProps {
  className?: string;
}

/**
 * ProceduresNavBadge component displays the real-time count of procedures.
 * Decision: If the count is 0, the badge is hidden entirely to maintain a clean UX,
 * as an empty badge typically adds unnecessary visual noise.
 */
export const ProceduresNavBadge = ({ className }: ProceduresNavBadgeProps) => {
  const count = useProcedureCount();

  if (count === 0) {
    return null;
  }

  return (
    <div className={className}>
      {count}
    </div>
  );
};
