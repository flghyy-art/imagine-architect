import type { ReactNode } from "react";
import { useState } from "react";
import { toast } from "sonner";
import { PHASE_BLOCKS, SHOT_CHIPS } from "@/lib/catalog";
import { copyText, composePrompt } from "@/lib/prompt-engine";
import { generateImage } from "@/lib/imagine";
import { useStudio } from "@/lib/store";
import { Textarea } from "@/components/ui/textarea";
import {
  AspectPicker,
  BoosterGrid,
  LayerToggles,
  StyleGrid,
} from "./config-controls";
import { PromptPreview } from "./prompt-preview";

export function BuilderPanel() {
  const subject = useStudio((s) => s.subject);
  const setSubject = useStudio((s) => s.setSubject);
  const insertBlock = useStudio((s) => s.insertBlock);
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
      toast("提示词已复制");
      setTimeout(() => setCopied(false), 1600);
    } else {
      toast.error("复制失败");
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
    toast("已加入图库");
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="space-y-6">
        <section className="space-y-3 rounded-lg border border-border bg-card p-4">
          <FieldLabel>风格</FieldLabel>
          <StyleGrid />
          <FieldLabel className="pt-2">视觉增强（可叠加）</FieldLabel>
          <BoosterGrid />
        </section>

        <section className="space-y-3">
          <FieldLabel>画面主体</FieldLabel>
          <Textarea
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="描述主体、服装、场景、镜头与光线。例如：成年侦探立于暴雨霓虹巷口，85mm 特写，雨水打在镜头上"
            className="min-h-32 font-mono text-xs leading-relaxed"
          />
          <div>
            <FieldLabel>镜头语法</FieldLabel>
            <div className="mt-2 flex flex-wrap gap-2">
              {SHOT_CHIPS.map((chip) => (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => insertBlock(chip.text)}
                  className="h-9 rounded-full border border-border px-3 text-xs text-muted-foreground transition-colors hover:border-input hover:text-foreground"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <FieldLabel>四段弧线</FieldLabel>
            <div className="mt-2 flex flex-wrap gap-2">
              {(
                [
                  ["1 建立", PHASE_BLOCKS.SETUP],
                  ["2 推进", PHASE_BLOCKS.BUILD],
                  ["3 高潮", PHASE_BLOCKS.PEAK],
                  ["4 收束", PHASE_BLOCKS.RESOLVE],
                ] as const
              ).map(([label, text]) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => insertBlock(text)}
                  className="h-9 rounded-md border border-border px-3 text-xs text-muted-foreground transition-colors hover:border-input hover:text-foreground"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="space-y-3 rounded-lg border border-border bg-card p-4">
          <FieldLabel>图层</FieldLabel>
          <LayerToggles />
        </section>
      </div>

      <aside className="space-y-4 self-start lg:sticky lg:top-20">
        <div className="rounded-lg border border-border bg-card p-4">
          <FieldLabel>画幅</FieldLabel>
          <div className="mt-3">
            <AspectPicker />
          </div>
        </div>
        <PromptPreview
          onCopy={() => void handleCopy()}
          onGenerate={() => void handleGenerate()}
          copied={copied}
          generating={generating}
        />
      </aside>
    </div>
  );
}

function FieldLabel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground ${className ?? ""}`}
    >
      {children}
    </div>
  );
}
