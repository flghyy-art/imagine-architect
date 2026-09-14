import { ART_STYLES, ASPECT_RATIOS, STYLE_BOOSTERS, VOICES } from "@/lib/catalog";
import { useStudio } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";

export function StyleGrid() {
  const styleId = useStudio((s) => s.styleId);
  const setStyle = useStudio((s) => s.setStyle);
  return (
    <div className="grid grid-cols-2 gap-2">
      {ART_STYLES.map((style) => {
        const on = styleId === style.id;
        return (
          <button
            key={style.id}
            type="button"
            onClick={() => setStyle(style.id)}
            className={cn(
              "rounded-md border px-3 py-2.5 text-left transition-colors duration-150",
              on
                ? "border-primary bg-secondary text-foreground"
                : "border-border bg-transparent text-muted-foreground hover:border-input hover:text-foreground",
            )}
          >
            <div className="text-sm">{style.label}</div>
            <div className="mt-0.5 text-[11px] text-muted-foreground">{style.hint}</div>
          </button>
        );
      })}
    </div>
  );
}

export function BoosterGrid() {
  const boosterIds = useStudio((s) => s.boosterIds);
  const toggleBooster = useStudio((s) => s.toggleBooster);
  return (
    <div className="grid grid-cols-2 gap-2">
      {STYLE_BOOSTERS.map((b) => {
        const on = boosterIds.includes(b.id);
        return (
          <button
            key={b.id}
            type="button"
            onClick={() => toggleBooster(b.id)}
            className={cn(
              "flex items-center justify-between rounded-md border px-3 py-2 text-left text-xs transition-colors duration-150",
              on
                ? "border-primary bg-secondary text-foreground"
                : "border-border text-muted-foreground hover:border-input hover:text-foreground",
            )}
          >
            <span>{b.label}</span>
            {on ? <span className="size-1.5 rounded-full bg-primary" /> : null}
          </button>
        );
      })}
    </div>
  );
}

export function AspectPicker() {
  const aspectRatio = useStudio((s) => s.aspectRatio);
  const setAspectRatio = useStudio((s) => s.setAspectRatio);
  return (
    <div className="flex flex-wrap gap-2">
      {ASPECT_RATIOS.map((ratio) => {
        const on = aspectRatio === ratio;
        return (
          <button
            key={ratio}
            type="button"
            onClick={() => setAspectRatio(ratio)}
            className={cn(
              "h-9 min-w-14 flex-1 rounded-md border font-mono text-xs transition-colors duration-150",
              on
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:text-foreground",
            )}
          >
            {ratio}
          </button>
        );
      })}
    </div>
  );
}

export function LayerToggles({ compact }: { compact?: boolean }) {
  const quality = useStudio((s) => s.quality);
  const setQuality = useStudio((s) => s.setQuality);
  const continuity = useStudio((s) => s.continuity);
  const setContinuity = useStudio((s) => s.setContinuity);
  const audio = useStudio((s) => s.audio);
  const setAudio = useStudio((s) => s.setAudio);
  const voiceId = useStudio((s) => s.voiceId);
  const setVoice = useStudio((s) => s.setVoice);

  return (
    <div className={cn("space-y-3", compact && "space-y-2")}>
      <ToggleRow
        label="品质前缀"
        hint="解剖结构、光影、无水印"
        checked={quality}
        onCheckedChange={setQuality}
      />
      <ToggleRow
        label="连续性锁定"
        hint="分镜续接时锁脸与服装"
        checked={continuity}
        onCheckedChange={setContinuity}
      />
      <ToggleRow
        label="音频层"
        hint="视频用：拟音与配乐"
        checked={audio}
        onCheckedChange={setAudio}
      />
      {audio ? (
        <div className="grid grid-cols-2 gap-2 pl-1">
          {VOICES.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setVoice(v.id)}
              className={cn(
                "rounded-md border px-3 py-2 text-left text-xs",
                voiceId === v.id
                  ? "border-primary bg-secondary text-foreground"
                  : "border-border text-muted-foreground",
              )}
            >
              {v.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function ToggleRow({
  label,
  hint,
  checked,
  onCheckedChange,
}: {
  label: string;
  hint: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-md border border-border bg-chip px-3 py-2.5">
      <div>
        <div className="text-sm text-foreground">{label}</div>
        <div className="text-[11px] text-muted-foreground">{hint}</div>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </label>
  );
}
