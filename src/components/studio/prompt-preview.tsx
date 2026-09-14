import { Check, Copy, ImagePlay, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildParts } from "@/lib/prompt-engine";
import { useStudio } from "@/lib/store";
import { cn } from "@/lib/utils";

export function PromptPreview({
  onCopy,
  onGenerate,
  copied,
  generating,
  compact,
}: {
  onCopy: () => void;
  onGenerate?: () => void;
  copied: boolean;
  generating?: boolean;
  compact?: boolean;
}) {
  const styleId = useStudio((s) => s.styleId);
  const boosterIds = useStudio((s) => s.boosterIds);
  const quality = useStudio((s) => s.quality);
  const continuity = useStudio((s) => s.continuity);
  const subject = useStudio((s) => s.subject);
  const audio = useStudio((s) => s.audio);
  const voiceId = useStudio((s) => s.voiceId);
  const aspectRatio = useStudio((s) => s.aspectRatio);
  const resetComposer = useStudio((s) => s.resetComposer);

  const parts = buildParts({
    styleId,
    boosterIds,
    quality,
    continuity,
    subject,
    audio,
    voiceId,
    aspectRatio,
  });

  return (
    <div className={cn("flex flex-col rounded-lg border border-border bg-card", compact && "rounded-md")}>
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
          Final Command
        </span>
        <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
          {copied ? "已复制" : "就绪"}
        </span>
      </div>
      <div className={cn("flex-1 bg-background px-4 py-3", compact ? "max-h-28 overflow-y-auto" : "min-h-36")}>
        <p className="font-mono text-[11px] leading-relaxed text-muted-foreground">
          <span className="text-foreground">{parts.style}</span>
          {parts.boosters.map((b) => (
            <span key={b}>
              {", "}
              {b}
            </span>
          ))}
          {parts.quality ? <span className="opacity-70">{`, ${parts.quality}`}</span> : null}
          {parts.continuity ? <span className="opacity-70">{`, ${parts.continuity}`}</span> : null}
          <span className="text-foreground">{subject ? `, ${subject}` : ", …"}</span>
          {parts.audio ? <span className="opacity-70">{`, ${parts.audio}`}</span> : null}
          <span>{` ${parts.aspect}`}</span>
        </p>
      </div>
      <div className="flex gap-2 border-t border-border p-3">
        <Button className="flex-1" onClick={onCopy}>
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
          {copied ? "已复制" : "复制提示词"}
        </Button>
        {onGenerate ? (
          <Button variant="secondary" onClick={onGenerate} disabled={generating || !subject.trim()}>
            <ImagePlay className="size-4" />
            {generating ? "出图中" : "出图"}
          </Button>
        ) : null}
        <Button variant="ghost" size="icon" onClick={resetComposer} aria-label="清空">
          <Trash2 className="size-4" />
        </Button>
      </div>
    </div>
  );
}
