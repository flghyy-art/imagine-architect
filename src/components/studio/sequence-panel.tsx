import { useMemo, useState } from "react";
import { Copy, Layers } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PHASE_BLOCKS } from "@/lib/catalog";
import { composePrompt, copyText } from "@/lib/prompt-engine";
import { useStudio } from "@/lib/store";
import { AspectPicker, BoosterGrid, LayerToggles, StyleGrid } from "./config-controls";

type Phase = { title: string; prompt: string };

export function SequencePanel() {
  const sequenceBase = useStudio((s) => s.sequenceBase);
  const setSequenceBase = useStudio((s) => s.setSequenceBase);
  const [phases, setPhases] = useState<Phase[]>([]);

  const generate = () => {
    const s = useStudio.getState();
    const base = s.sequenceBase.trim();
    if (!base) return;

    const mk = (subject: string, first: boolean, last: boolean) =>
      composePrompt({
        styleId: s.styleId,
        boosterIds: s.boosterIds,
        quality: first && s.quality,
        continuity: !first,
        subject,
        audio: s.audio,
        voiceId: s.voiceId,
        aspectRatio: s.aspectRatio,
      });

    setPhases([
      {
        title: "Phase 1 · 建立",
        prompt: mk(`${base}. ${PHASE_BLOCKS.SETUP}`, true, false),
      },
      {
        title: "Phase 2 · 推进",
        prompt: mk(`${base}, ${PHASE_BLOCKS.BUILD}`, false, false),
      },
      {
        title: "Phase 3 · 高潮",
        prompt: mk(`${PHASE_BLOCKS.PEAK}. ${base}`, false, false),
      },
      {
        title: "Phase 4 · 收束",
        prompt: mk(`${PHASE_BLOCKS.RESOLVE}. ${base}`, false, true),
      },
    ]);
  };

  const strategy = useMemo(
    () => [
      { n: "1", t: "建立", d: "锁定场景、光线、人物站位。" },
      { n: "2", t: "推进", d: "机位靠近，动作与张力上升，开启连续性。" },
      { n: "3", t: "高潮", d: "决定性瞬间，光斑与动作峰值。" },
      { n: "4", t: "收束", d: "余韵与停顿，情绪落地。" },
    ],
    [],
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
      <div className="space-y-5">
        <section className="space-y-3 rounded-lg border border-border bg-card p-4">
          <StyleGrid />
          <BoosterGrid />
          <LayerToggles compact />
        </section>

        <section className="space-y-3">
          <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            核心场景
          </div>
          <Textarea
            value={sequenceBase}
            onChange={(e) => setSequenceBase(e.target.value)}
            placeholder="作为四段分镜的锚点。例如：烛光卧室，缓慢靠近的对话，眼神交汇"
            className="min-h-24 font-mono text-xs"
          />
          <Button className="w-full" disabled={!sequenceBase.trim()} onClick={generate}>
            <Layers className="size-4" />
            生成四段分镜
          </Button>
        </section>

        {phases.length > 0 ? (
          <div className="space-y-3">
            {phases.map((phase, idx) => (
              <article key={phase.title} className="overflow-hidden rounded-lg border border-border bg-card">
                <header className="flex items-center justify-between border-b border-border px-4 py-2">
                  <span className="text-xs font-medium text-foreground">{phase.title}</span>
                  <button
                    type="button"
                    className="inline-flex h-8 items-center gap-1 rounded-md px-2 text-[11px] text-muted-foreground hover:bg-accent hover:text-foreground"
                    onClick={async () => {
                      const ok = await copyText(phase.prompt);
                      toast(ok ? `已复制 ${phase.title}` : "复制失败");
                    }}
                  >
                    <Copy className="size-3" />
                    复制
                  </button>
                </header>
                <textarea
                  className="min-h-28 w-full resize-y bg-transparent px-4 py-3 font-mono text-[11px] leading-relaxed text-muted-foreground focus-visible:outline-none"
                  value={phase.prompt}
                  onChange={(e) => {
                    const next = [...phases];
                    next[idx] = { ...phase, prompt: e.target.value };
                    setPhases(next);
                  }}
                />
              </article>
            ))}
          </div>
        ) : null}
      </div>

      <aside className="space-y-4 self-start lg:sticky lg:top-20">
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            画幅
          </div>
          <div className="mt-3">
            <AspectPicker />
          </div>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            弧线策略
          </div>
          <ul className="mt-3 space-y-3">
            {strategy.map((item) => (
              <li key={item.n} className="text-sm">
                <div className="font-medium text-foreground">
                  {item.n}. {item.t}
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">{item.d}</p>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
