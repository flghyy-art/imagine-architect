import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { composePrompt, copyText } from "@/lib/prompt-engine";
import { generateImage } from "@/lib/imagine";
import { useStudio } from "@/lib/store";
import { AspectPicker, BoosterGrid, LayerToggles, StyleGrid } from "./config-controls";
import { PromptPreview } from "./prompt-preview";

export function ComposeDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const subject = useStudio((s) => s.subject);
  const setSubject = useStudio((s) => s.setSubject);
  const addGallery = useStudio((s) => s.addGallery);
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);

  const handleCopy = async () => {
    const s = useStudio.getState();
    const prompt = composePrompt({
      styleId: s.styleId,
      boosterIds: s.boosterIds,
      quality: s.quality,
      continuity: s.continuity,
      subject: s.subject,
      audio: s.audio,
      voiceId: s.voiceId,
      aspectRatio: s.aspectRatio,
    });
    const ok = await copyText(prompt);
    if (ok) {
      setCopied(true);
      toast("提示词已复制，可粘贴到 Grok Imagine");
      setTimeout(() => setCopied(false), 1600);
    }
  };

  const handleGenerate = async () => {
    const s = useStudio.getState();
    if (!s.subject.trim()) return;
    setGenerating(true);
    const prompt = composePrompt({
      styleId: s.styleId,
      boosterIds: s.boosterIds,
      quality: s.quality,
      continuity: s.continuity,
      subject: s.subject,
      audio: s.audio,
      voiceId: s.voiceId,
      aspectRatio: s.aspectRatio,
    });
    const result = await generateImage({
      data: { prompt, aspectRatio: s.aspectRatio },
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>提示词对话框</DialogTitle>
          <DialogDescription>
            在这里写画面、选风格，复制即可用于 Grok Imagine。
          </DialogDescription>
        </DialogHeader>
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-6 py-4">
          <Textarea
            autoFocus
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="成年角色，场景，镜头，光线…"
            className="min-h-24 font-mono text-xs"
          />
          <AspectPicker />
          <StyleGrid />
          <BoosterGrid />
          <LayerToggles compact />
        </div>
        <div className="border-t border-border px-6 py-3">
          <PromptPreview
            compact
            onCopy={() => void handleCopy()}
            onGenerate={() => void handleGenerate()}
            copied={copied}
            generating={generating}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
