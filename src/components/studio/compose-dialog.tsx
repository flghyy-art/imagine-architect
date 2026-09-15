import { useEffect, useRef, useState } from "react";
import { Check, Copy, ImagePlay } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ART_STYLES } from "@/lib/catalog";
import { composePrompt, copyText } from "@/lib/prompt-engine";
import { generateImage } from "@/lib/imagine";
import { useStudio } from "@/lib/store";
import { AspectPicker } from "./config-controls";

export function ComposeDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const setSubject = useStudio((s) => s.setSubject);
  const addGallery = useStudio((s) => s.addGallery);
  const styleId = useStudio((s) => s.styleId);
  const setStyle = useStudio((s) => s.setStyle);
  const [draft, setDraft] = useState("");
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!open) return;
    setDraft(useStudio.getState().subject);
    const id = window.setTimeout(() => inputRef.current?.focus(), 20);
    return () => window.clearTimeout(id);
  }, [open]);

  const updateDraft = (value: string) => {
    setDraft(value);
    setSubject(value);
  };

  const assembled = () => {
    const s = useStudio.getState();
    return composePrompt({
      styleId: s.styleId,
      boosterIds: s.boosterIds,
      quality: s.quality,
      continuity: s.continuity,
      subject: draft,
      audio: s.audio,
      voiceId: s.voiceId,
      aspectRatio: s.aspectRatio,
    });
  };

  const handleCopy = async () => {
    if (!draft.trim()) {
      toast("先写画面描述");
      inputRef.current?.focus();
      return;
    }
    const ok = await copyText(assembled());
    if (ok) {
      setCopied(true);
      toast("提示词已复制，可粘贴到 Grok Imagine");
      setTimeout(() => setCopied(false), 1600);
    } else {
      toast.error("复制失败，请手动选择文本");
    }
  };

  const handleGenerate = async () => {
    if (!draft.trim()) {
      toast("先写画面描述");
      inputRef.current?.focus();
      return;
    }
    setGenerating(true);
    const prompt = assembled();
    const result = await generateImage({
      data: { prompt, aspectRatio: useStudio.getState().aspectRatio },
    });
    setGenerating(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    addGallery({
      id: crypto.randomUUID(),
      prompt,
      imageUrl: result.url,
      createdAt: Date.now(),
    });
    toast("已出图并加入图库");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={false}>
      <DialogContent
        className="max-w-xl"
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          inputRef.current?.focus();
        }}
      >
        <DialogHeader>
          <DialogTitle>提示词对话框</DialogTitle>
          <DialogDescription>直接在下面输入画面，复制即可用于 Grok Imagine。</DialogDescription>
        </DialogHeader>
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-6 py-4">
          <Textarea
            ref={inputRef}
            value={draft}
            onChange={(e) => updateDraft(e.target.value)}
            placeholder="例如：雨夜里穿风衣的侦探走进霓虹巷子，85mm 特写，雨水打在镜头上"
            className="min-h-40 text-sm leading-relaxed"
          />
          <AspectPicker />
          <div className="flex flex-wrap gap-2">
            {ART_STYLES.map((style) => {
              const on = styleId === style.id;
              return (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => setStyle(style.id)}
                  className={`h-9 shrink-0 rounded-full border px-3 text-xs transition-colors ${
                    on
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {style.label}
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex gap-2 border-t border-border px-6 py-3">
          <Button className="flex-1" onClick={() => void handleCopy()} disabled={!draft.trim()}>
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            {copied ? "已复制" : "复制提示词"}
          </Button>
          <Button
            variant="secondary"
            onClick={() => void handleGenerate()}
            disabled={generating || !draft.trim()}
          >
            <ImagePlay className="size-4" />
            {generating ? "出图中" : "出图"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
