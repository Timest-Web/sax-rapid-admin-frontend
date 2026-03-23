"use client";

import { useState } from "react";
import { FileText, Eye, CheckCircle2, Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

interface Document {
  id: number;
  name: string;
  type: string;
  status: string;
  date: string;
  url?: string;
}

export function KycViewer({
  documents,
}: {
  documents: Document[] | undefined;
}) {
  const [docs, setDocs] = useState(documents || []);

  const verifyDoc = (id: number) => {
    setDocs(docs.map((d) => (d.id === id ? { ...d, status: "Verified" } : d)));
    toast.success("Document verified");
  };

  const rejectDoc = (id: number) => {
    setDocs(docs.map((d) => (d.id === id ? { ...d, status: "Rejected" } : d)));
    toast.error("Document rejected");
  };

  if (docs.length === 0) {
    return (
      <div className="p-12 text-center border border-dashed border-zinc-200 rounded-lg">
        <p className="text-zinc-400 font-mono text-sm">
          No KYC documents uploaded.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {docs.map((doc) => (
        <div
          key={doc.id}
          className="bg-white border border-zinc-200 rounded-lg p-4 flex flex-col justify-between hover:border-sax-gold transition-colors group"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-zinc-50 rounded flex items-center justify-center text-zinc-400 group-hover:text-zinc-900">
                <FileText size={20} />
              </div>
              <div>
                <p className="font-bold text-sm text-zinc-900 line-clamp-1">
                  {doc.name}
                </p>
                <p className="text-[10px] text-zinc-400 font-mono uppercase">
                  {doc.type} • {doc.date}
                </p>
              </div>
            </div>
            {doc.status === "Verified" ? (
              <CheckCircle2 className="text-emerald-500 h-5 w-5" />
            ) : doc.status === "Rejected" ? (
              <X className="text-rose-500 h-5 w-5" />
            ) : (
              <Clock className="text-amber-500 h-5 w-5" />
            )}
          </div>

          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 h-8 text-[10px]"
                >
                  <Eye className="mr-2 h-3 w-3" /> Preview
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl h-[80vh] flex items-center justify-center bg-zinc-900 border-zinc-800">
                <p className="text-zinc-500 font-mono">
                  [ DOCUMENT PREVIEW WOULD RENDER HERE ]
                </p>
              </DialogContent>
            </Dialog>
            {doc.status === "Pending" && (
              <div className="flex gap-1 flex-1">
                <Button
                  onClick={() => rejectDoc(doc.id)}
                  variant="ghost"
                  size="sm"
                  className="flex-1 h-8 text-rose-600 hover:bg-rose-50 hover:text-rose-700 px-0"
                >
                  Reject
                </Button>
                <Button
                  onClick={() => verifyDoc(doc.id)}
                  variant="gold"
                  size="sm"
                  className="flex-1 h-8 text-[10px] px-0"
                >
                  Verify
                </Button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
