"use client";

import { StatsGridSkeleton } from "./stat-grid";
import { TableSkeleton } from "./table-skeleton";

export function StatsAndTableSkeleton(props: {
  statsCount?: number;
  tableColumns?: number;
  tableRows?: number;
}) {
  return (
    <div className="space-y-6">
      <StatsGridSkeleton count={props.statsCount ?? 4} />
      <TableSkeleton
        columns={props.tableColumns ?? 6}
        rows={props.tableRows ?? 10}
      />
    </div>
  );
}