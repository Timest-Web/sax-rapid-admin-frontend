import { Dispute } from "@/src/views/disputes/column";
import { DisputeListItem } from "./api";


function formatMoney(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString()}`;
  }
}

function normalizeStatus(s: string): Dispute["status"] {
  const v = (s ?? "").toLowerCase();
  if (v.includes("resolve")) return "resolved";
  if (v.includes("open")) return "open";
  if (v.includes("review")) return "review";
  if (v.includes("close")) return "closed";
  return "open";
}

function computePriority(disputedAmount: number): Dispute["priority"] {
  if (disputedAmount >= 500_000) return "high";
  if (disputedAmount >= 100_000) return "medium";
  return "low";
}

export function toDisputeRow(x: DisputeListItem): Dispute {
  return {
    id: x.id,
    ticketId: x.caseId,          // show caseId as ticketId
    type: "refund",              // backend list doesn’t provide; default
    priority: computePriority(x.disputedAmount),
    buyerName: x.buyerName,
    vendorName: x.vendorName,
    amount: formatMoney(x.disputedAmount, x.currency),
    orderId: "—",                // backend list doesn’t provide; placeholder
    date: new Date(x.createdAt).toLocaleDateString(), // or relative time if you want
    status: normalizeStatus(x.status),
  };
}