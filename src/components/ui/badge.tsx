import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-lg border border-[#D1CCC4] px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none",
  {
    variants: {
      variant: {
        default:
          "border-[#C05E3E] bg-[#C05E3E] text-[#FAF9F6] hover:bg-[#AD5234]",
        secondary:
          "border-[#D1CCC4] bg-[#E6E2DA] text-[#0E0E0E] hover:bg-[#DDD8CE]",
        destructive:
          "border-[#0E0E0E] bg-[#0E0E0E] text-[#FAF9F6] hover:bg-[#262626]",
        outline: "border-[#D1CCC4] bg-[#FAF9F6] text-[#0E0E0E]",
        accent: "border-[#D1CCC4] bg-[#EBE7DF] text-[#0E0E0E]",
        muted: "border-[#D1CCC4] bg-[#EFECE6] text-[#5C5852]",
        // Semantic aliases mapped to Claude Crimson palette
        cyan: "border-[#C05E3E]/40 bg-[#C05E3E]/12 text-[#A64B2E] font-mono",
        violet: "border-[#D1CCC4] bg-[#E6E2DA] text-[#0E0E0E] font-mono",
        amber: "border-[#C05E3E] bg-[#C05E3E] text-[#FAF9F6] font-mono",
        emerald: "border-[#D1CCC4] bg-[#EFECE6] text-[#4A4640] font-mono",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
