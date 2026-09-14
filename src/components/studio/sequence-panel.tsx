import { useState } from "react";
import { Copy, ImagePlay, Layers, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ART_STYLES, PHASE_BLOCKS } from "@/lib/catalog";
import { generateImage } from "@/lib/imagine";
import { composePrompt, copyText } from "@/lib/prompt-engine";
import { useStudio, type SequencePhase } from "@/lib/store";
import { AspectPicker } from "./config-controls";

const PHASE_META = [
  { key: "setup", n: "1", title: "建立", hint: "锁定场景、光线、人物站位。", block: PHASE_BLOCKS.SETUP, first: true, last: false },
  { key: "build", n: "2", title: "推进", hint: "机位靠近，动作与张力上升，开启连续性。", block: PHASE_BLOCKS.BUILD, first: false, last: false },
  { key: "peak", n: "3", title: "高潮", hint: "决定性瞬间，光斑与动作峰值。", block: PHASE_BLOCKS.PEAK, first: false, last: false },
  { key: "resolve", n: "4", title: "收束", hint: "余韵与停顿，情绪落地。", block: PHASE_BLOCKS.RESOLVE, first: false, last: true },
] as const;

function subjectFor(base: string, meta: (typeof PHASE_META)[number]) {
  if (meta.key === "setup") return `${base}. ${meta.block}`;
  if (meta.key === "build") return `${base}, ${meta.block}`;
  return `${meta.block}. ${base}`;
}

export function SequencePanel() {
  const sequenceBase = useStudio((s) => s.sequenceBase);
  const setSequenceBase = useStudio((s) => s.setSequenceBase);
  const sequencePhases = useStudio((s) => s.sequencePhases) ?? [];
  const setSequencePhases = useStudio((s) => s.setSequencePhases);
  const patchSequencePhase = useStudio((s) => s.patchSequencePhase);
  const addGallery = useStudio((s) => s.addGallery);
  const styleId = useStudio((s) => s.styleId);
  const setStyle = useStudio((s) => s.setStyle);
  const [genKey, setGenKey] = useState<string | null>(null);

  const byKey = new Map(sequencePhases.map((p) => [p.key, p]));

  const generate = () => {
    const s = useStudio.getState();
    const base = s.sequenceBase.trim();
    if (!base) {
      toast("先写核心场景");
      return;
    }
    const next: SequencePhase[] = PHASE_META.map((meta) => ({
      key: meta.key,
      title: `${meta.n} ${meta.title}`,
      prompt: composePrompt({
        styleId: s.styleId,
        boosterIds: s.boosterIds,
        quality: meta.first && s.quality,
        continuity: !meta.first,
        subject: subjectFor(base, meta),
        audio: s.audio,
        voiceId: s.voiceId,
        aspectRatio: s.aspectRatio,
      }),
      imageUrl: byKey.get(meta.key)?.imageUrl,
    }));
    setSequencePhases(next);
    toast("四段分镜已生成，可分别复制");
  };

  const handleGenerateShot = async (phase: SequencePhase) => {
    if (!phase.prompt.trim()) return;
    setGenKey(phase.key);
    const result = await generateImage({
      data: { prompt: phase.prompt, aspectRatio: useStudio.getState().aspectRatio },
    });
    setGenKey(null);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    patchSequencePhase(phase.key, { imageUrl: result.url });
    addGallery({
      id: crypto.randomUUID(),
      prompt: phase.prompt,
      imageUrl: result.url,
      createdAt: Date.now(),
    });
    toast(`第 ${phase.title} 镜已出图`);
  };

  return (
    <div className="space-y-5">
      <section className="space-y-3 rounded-lg border border-border bg-card p-4">
        <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
          核心场景
        </div>
        <Textarea
          value={sequenceBase}
          onChange={(e) => setSequenceBase(e.target.value)}
          placeholder="四段分镜的锚点。例如：烛光卧室，缓慢靠近的对话，眼神交汇"
          className="min-h-24 font-mono text-xs"
        />
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
        <AspectPicker />
        <Button className="w-full" disabled={!sequenceBase.trim()} onClick={generate}>
          <Layers className="size-4" />
          生成四段分镜
        </Button>
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        {PHASE_META.map((meta) => {
          const stored = byKey.get(meta.key);
          const prompt = stored?.prompt ?? "";
          const imageUrl = stored?.imageUrl;
          return (
            <article
              key={meta.key}
              className="flex min-h-56 flex-col overflow-hidden rounded-lg border border-border bg-card"
            >
              <header className="flex items-center justify-between gap-2 border-b border-border px-4 py-2.5">
                <div>
                  <div className="text-sm font-medium text-foreground">
                    {meta.n}. {meta.title}
                  </div>
                  <p className="text-[11px] text-muted-foreground">{meta.hint}</p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    disabled={!prompt}
                    onClick={async () => {
                      const ok = await copyText(prompt);
                      toast(ok ? `已复制第 ${meta.n} 镜` : "复制失败");
                    }}
                  >
                    <Copy className="size-3.5" />
                    复制
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    disabled={!prompt || genKey === meta.key}
                    onClick={() =>
                      void handleGenerateShot({
                        key: meta.key,
                        title: `${meta.n} ${meta.title}`,
                        prompt,
                        imageUrl,
                      })
                    }
                  >
                    {genKey === meta.key ? (
                      <LoaderCircle className="size-3.5 animate-spin" />
                    ) : (
                      <ImagePlay className="size-3.5" />
                    )}
                    出图
                  </Button>
                </div>
              </header>
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={`第 ${meta.n} 镜`}
                  className="max-h-48 w-full object-cover outline outline-1 -outline-offset-1 outline-white/10"
                />
              ) : null}
              <textarea
                className="min-h-32 w-full flex-1 resize-y bg-transparent px-4 py-3 font-mono text-[11px] leading-relaxed text-muted-foreground focus-visible:outline-none"
                value={prompt}
                placeholder={`生成后这里会出现第 ${meta.n} 镜提示词`}
                onChange={(e) => {
                  const nextPrompt = e.target.value;
                  const existing = useStudio.getState().sequencePhases ?? [];
                  if (existing.some((p) => p.key === meta.key)) {
                    patchSequencePhase(meta.key, { prompt: nextPrompt });
                    return;
                  }
                  setSequencePhases(
                    PHASE_META.map((m) => ({
                      key: m.key,
                      title: `${m.n} ${m.title}`,
                      prompt: m.key === meta.key ? nextPrompt : (byKey.get(m.key)?.prompt ?? ""),
                      imageUrl: byKey.get(m.key)?.imageUrl,
                    })),
                  );
                }}
              />
            </article>
          );
        })}
      </section>
    </div>
  );
}
