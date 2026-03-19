import { AssignmentStatus } from "@/types";
import { getStatusConfig, cn } from "@/lib/utils";

interface BadgeProps {
  status: AssignmentStatus;
  className?: string;
}

export default function Badge({ status, className }: BadgeProps) {
  const config = getStatusConfig(status);
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
