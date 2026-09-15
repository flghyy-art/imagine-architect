import { useRef, useState } from "react";
import { ArrowUp, Copy, ImagePlay, LoaderCircle, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { ART_STYLES, STYLE_BY_ID } from "@/lib/catalog";
import { expandScene, generateImage } from "@/lib/imagine";
import { composePrompt, copyText } from "@/lib/prompt-engine";
import { useStudio } from "@/lib/store";

export function ChatPanel() {
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [genId, setGenId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const messages = useStudio((s) => s.messages);
  const addMessage = useStudio((s) => s.addMessage);
  const patchMessage = useStudio((s) => s.patchMessage);
  const addGallery = useStudio((s) => s.addGallery);
  const setSubject = useStudio((s) => s.setSubject);
  const styleId = useStudio((s) => s.styleId);
  const setStyle = useStudio((s) => s.setStyle);

  const send = async () => {
    const brief = draft.trim();
    if (!brief || busy) return;
    setDraft("");
    setBusy(true);
    addMessage({
      id: crypto.randomUUID(),
      role: "user",
      text: brief,
      createdAt: Date.now(),
    });

    const styleHint = STYLE_BY_ID[useStudio.getState().styleId]?.prompt ?? "";
    const expanded = await expandScene({ data: { brief, styleHint } });
    if (!expanded.ok) {
      addMessage({
        id: crypto.randomUUID(),
        role: "assistant",
        text: expanded.error,
        createdAt: Date.now(),
      });
      setBusy(false);
      return;
    }

    setSubject(expanded.subject);
    const s = useStudio.getState();
    const prompt = composePrompt({
      styleId: s.styleId,
      boosterIds: s.boosterIds,
      quality: s.quality,
      continuity: s.continuity,
      subject: expanded.subject,
      audio: s.audio,
      voiceId: s.voiceId,
      aspectRatio: s.aspectRatio,
    });

    addMessage({
      id: crypto.randomUUID(),
      role: "assistant",
      text: "已按当前风格与图层组装完成。可复制到 Grok Imagine，或直接出一张静帧。",
      prompt,
      createdAt: Date.now(),
    });
    setBusy(false);
    requestAnimationFrame(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }));
  };

  const handleCopy = async (prompt: string) => {
    const ok = await copyText(prompt);
    toast(ok ? "提示词已复制" : "复制失败，请手动选择");
  };

  const handleGenerate = async (msgId: string, prompt: string) => {
    setGenId(msgId);
    const result = await generateImage({
      data: { prompt, aspectRatio: useStudio.getState().aspectRatio },
    });
    setGenId(null);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    patchMessage(msgId, { imageUrl: result.url });
    addGallery({
      id: crypto.randomUUID(),
      prompt,
      imageUrl: result.url,
      createdAt: Date.now(),
    });
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex gap-2 overflow-x-auto pb-3">
        {ART_STYLES.map((style) => (
          <button
            key={style.id}
            type="button"
            onClick={() => setStyle(style.id)}
            className={`h-9 shrink-0 rounded-full border px-3 text-xs transition-colors ${
              styleId === style.id
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {style.label}
          </button>
        ))}
      </div>

      <ScrollArea className="min-h-0 flex-1 rounded-lg border border-border bg-card">
        <div className="space-y-5 p-4 sm:p-5">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[min(100%,36rem)] rounded-lg px-4 py-3 ${
                  m.role === "user"
                    ? "rounded-br-sm bg-primary text-primary-foreground"
                    : "rounded-bl-sm bg-muted text-foreground"
                }`}
              >
                <p className="text-sm leading-relaxed">{m.text}</p>
                {m.prompt ? (
                  <div className="mt-3 rounded-md border border-border bg-background p-3">
                    <p className="font-mono text-[11px] leading-relaxed text-muted-foreground">
                      {m.prompt}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button size="sm" variant="secondary" onClick={() => handleCopy(m.prompt!)}>
                        <Copy className="size-3.5" />
                        复制
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleGenerate(m.id, m.prompt!)}
                        disabled={genId === m.id}
                      >
                        {genId === m.id ? (
                          <LoaderCircle className="size-3.5 animate-spin" />
                        ) : (
                          <ImagePlay className="size-3.5" />
                        )}
                        出图
                      </Button>
                    </div>
                    {m.imageUrl ? (
                      <img
                        src={m.imageUrl}
                        alt="生成结果"
                        className="mt-3 w-full rounded-md border border-border"
                      />
                    ) : null}
                  </div>
                ) : null}
              </div>
            </div>
          ))}
          {busy ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="size-4" />
              正在组装提示词…
            </div>
          ) : null}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      <form
        className="mt-3 flex items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          void send();
        }}
      >
        <Textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="描述画面，例如：雨夜里穿风衣的侦探走进霓虹巷子，跟踪镜头"
          className="min-h-[72px] resize-none bg-card"
          onKeyDown={(e) => {
            if (e.nativeEvent.isComposing || e.keyCode === 229) return;
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void send();
            }
          }}
        />
        <Button
          type="submit"
          size="icon"
          className="mb-0.5 size-12 shrink-0 rounded-lg"
          disabled={!draft.trim() || busy}
          aria-label="发送"
        >
          <ArrowUp className="size-5" />
        </Button>
      </form>
    </div>
  );
}
