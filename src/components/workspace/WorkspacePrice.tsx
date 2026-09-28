/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

interface WorkspacePriceProps {
  amount: number;
  className?: string;
}

export function WorkspacePrice({ amount, className = '' }: WorkspacePriceProps) {
  return (
    <div className={`flex items-baseline gap-1 ${className}`}>
      <span className="text-xs text-[#9C949B] font-medium">From</span>
      <span className="text-lg sm:text-xl font-bold font-sans tracking-tight text-[#252126]">
        ₹{amount}
      </span>
      <span className="text-xs text-[#6F6870] font-medium">/ day</span>
    </div>
  );
}
