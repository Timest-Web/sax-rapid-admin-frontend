"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { FileText, Eye, ExternalLink, CheckCircle2, Clock, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export type KycDoc = {
  id: string; // uuid
  documentType: string;
  fileUrl: string;
  submittedAt: string; // ISO
  status: string; // e.g. Pending / Verified / Rejected
};

function dateLabel(iso?: string | null) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return String(iso);
  }
}

function statusMeta(status: string) {
  const s = String(status || "").toLowerCase();

  if (s.includes("verified")) {
    return {
      icon: <CheckCircle2 className="h-5 w-5 text-emerald-600" />,
      pill: "bg-emerald-50 text-emerald-700 border-emerald-200",
      label: "Verified",
    };
  }

  if (s.includes("reject")) {
    return {
      icon: <XCircle className="h-5 w-5 text-rose-600" />,
      pill: "bg-rose-50 text-rose-700 border-rose-200",
      label: "Rejected",
    };
  }

  return {
    icon: <Clock className="h-5 w-5 text-amber-600" />,
    pill: "bg-amber-50 text-amber-700 border-amber-200",
    label: status || "Pending",
  };
}

function fileKind(url: string) {
  const u = String(url || "").toLowerCase();
  if (u.endsWith(".pdf")) return "pdf";
  if (u.endsWith(".png") || u.endsWith(".jpg") || u.endsWith(".jpeg") || u.endsWith(".webp") || u.endsWith(".gif"))
    return "image";
  return "other";
}

export function KycViewer({
  documents,
  onVerify,
  onReject,
  isMutating,
}: {
  documents: KycDoc[] | undefined;
  onVerify?: (docId: string) => void;
  onReject?: (docId: string) => void;
  isMutating?: boolean;
}) {
  const docs = documents ?? [];
  const [preview, setPreview] = useState<KycDoc | null>(null);

  const sorted = useMemo(() => {
    return [...docs].sort((a, b) => {
      const da = new Date(a.submittedAt).getTime();
      const db = new Date(b.submittedAt).getTime();
      return db - da;
    });
  }, [docs]);

  if (sorted.length === 0) {
    return (
      <div className="p-12 text-center border border-dashed border-zinc-200 rounded-lg bg-white">
        <p className="text-zinc-400 font-mono text-sm">No KYC documents uploaded.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sorted.map((doc) => {
          const meta = statusMeta(doc.status);

          return (
            <div
              key={doc.id}
              className="bg-white border border-zinc-200 rounded-2xl p-4 flex flex-col justify-between hover:border-[#D4AF37] transition-colors group"
            >
              <div className="flex items-start justify-between mb-4 gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-10 w-10 bg-zinc-50 rounded-xl border border-zinc-200 flex items-center justify-center text-zinc-400 group-hover:text-zinc-900 shrink-0">
                    <FileText size={18} />
                  </div>

                  <div className="min-w-0">
                    <p className="font-bold text-sm text-zinc-900 line-clamp-1">
                      {doc.documentType || "Document"}
                    </p>
                    <p className="text-[10px] text-zinc-400 font-mono uppercase">
                      Submitted: {dateLabel(doc.submittedAt)}
                    </p>

                    <span
                      className={`inline-flex mt-2 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${meta.pill}`}
                    >
                      {meta.label}
                    </span>
                  </div>
                </div>

                <div className="shrink-0">{meta.icon}</div>
              </div>

              <div className="flex gap-2">
                {/* Preview */}
                <Dialog
                  open={preview?.id === doc.id}
                  onOpenChange={(o) => setPreview(o ? doc : null)}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 h-9 text-[10px] font-bold uppercase tracking-widest"
                      disabled={!doc.fileUrl}
                      onClick={() => setPreview(doc)}
                    >
                      <Eye className="mr-2 h-3.5 w-3.5" /> Preview
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="sm:max-w-[980px] max-h-[85vh] overflow-hidden p-0 bg-white border-zinc-200 rounded-2xl">
                    <div className="p-4 border-b border-zinc-100 bg-zinc-50/50 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs font-bold uppercase tracking-widest text-zinc-900">
                          {doc.documentType}
                        </p>
                        {/* <p className="text-[11px] text-zinc-500 font-mono truncate">
                          {doc.fileUrl}
                        </p> */}
                      </div>

                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="h-9 text-[10px] font-bold uppercase tracking-widest"
                      >
                        <a href={doc.fileUrl} target="_blank" rel="noreferrer">
                          <ExternalLink className="mr-2 h-3.5 w-3.5" />
                          Open
                        </a>
                      </Button>
                    </div>

                    <div className="p-4 max-h-[75vh] overflow-auto bg-zinc-900">
                      {fileKind(doc.fileUrl) === "image" ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={doc.fileUrl}
                          alt={doc.documentType}
                          className="max-w-full mx-auto rounded-xl border border-zinc-800 bg-white"
                        />
                      ) : fileKind(doc.fileUrl) === "pdf" ? (
                        <iframe
                          src={doc.fileUrl}
                          className="w-full h-[70vh] rounded-xl border border-zinc-800 bg-white"
                        />
                      ) : (
                        <div className="h-[50vh] flex items-center justify-center text-zinc-300 text-sm font-mono">
                          Preview not supported for this file. Use “Open”.
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>

                {/* Optional actions (only show if callbacks exist) */}
                {onReject && onVerify ? (
                  <div className="flex gap-1 flex-1">
                    <Button
                      onClick={() => onReject(doc.id)}
                      variant="ghost"
                      size="sm"
                      className="flex-1 h-9 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                      disabled={isMutating}
                    >
                      Reject
                    </Button>
                    <Button
                      onClick={() => onVerify(doc.id)}
                      variant="gold"
                      size="sm"
                      className="flex-1 h-9 text-[10px]"
                      disabled={isMutating}
                    >
                      Verify
                    </Button>
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}