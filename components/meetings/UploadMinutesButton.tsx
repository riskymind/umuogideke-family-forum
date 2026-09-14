"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useUploadThing } from "@/lib/uploadthing-client";
import { setMeetingMinutes } from "@/actions/meetings";

export function UploadMinutesButton({ meetingId }: { meetingId: string }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const { startUpload } = useUploadThing("minutesUploader", {
    onClientUploadComplete: async (res) => {
      const file = res?.[0];
      if (file) {
        await setMeetingMinutes(meetingId, file.ufsUrl ?? file.url, file.name);
        router.refresh();
      }
      setBusy(false);
    },
    onUploadError: () => setBusy(false),
  });

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            setBusy(true);
            startUpload([file]);
          }
          e.target.value = "";
        }}
      />
      <button
        onClick={() => inputRef.current?.click()}
        disabled={busy}
        className="rounded-md px-3.5 py-2 text-xs font-semibold text-ink cursor-pointer disabled:opacity-60"
        style={{ background: "var(--color-chip-bg)" }}
      >
        {busy ? "Uploading…" : "Upload Minutes"}
      </button>
    </>
  );
}
