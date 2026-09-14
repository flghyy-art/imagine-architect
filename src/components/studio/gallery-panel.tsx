import { Copy, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PRINCIPLES } from "@/lib/catalog";
import { copyText } from "@/lib/prompt-engine";
import { useStudio } from "@/lib/store";

export function GalleryPanel() {
  const gallery = useStudio((s) => s.gallery);
  const logs = useStudio((s) => s.logs);
  const addLog = useStudio((s) => s.addLog);
  const deleteLog = useStudio((s) => s.deleteLog);
  const styleId = useStudio((s) => s.styleId);

  const wins = logs.filter((l) => l.result === "Pass").length;
  const rate = logs.length ? Math.round((wins / logs.length) * 100) : 0;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
      <div className="space-y-8">
        <section>
          <h2 className="font-display text-xl">图库</h2>
          <p className="mt-1 text-sm text-muted-foreground">本次会话出图会留在本地，方便对照提示词。</p>
          {gallery.length === 0 ? (
            <div className="mt-4 rounded-lg border border-dashed border-border px-4 py-12 text-center text-sm text-muted-foreground">
              还没有出图。在对话框或组装台点「出图」。
            </div>
          ) : (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {gallery.map((g) => (
                <figure key={g.id} className="overflow-hidden rounded-lg border border-border bg-card">
                  <img src={g.imageUrl} alt="" className="aspect-video w-full object-cover" />
                  <figcaption className="space-y-2 p-3">
                    <p className="line-clamp-3 font-mono text-[11px] text-muted-foreground">{g.prompt}</p>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={async () => {
                        const ok = await copyText(g.prompt);
                        toast(ok ? "已复制该图提示词" : "复制失败");
                      }}
                    >
                      <Copy className="size-3.5" />
                      复制
                    </Button>
                  </figcaption>
                </figure>
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="flex items-end justify-between gap-3">
            <div>
              <h2 className="font-display text-xl">试验日志</h2>
              <p className="mt-1 text-sm text-muted-foreground">记录哪些风格真正过了 Imagine。</p>
            </div>
            <div className="font-mono text-sm tabular-nums text-muted-foreground">
              {logs.length ? `${rate}% 通过` : "暂无"}
            </div>
          </div>
          <form
            className="mt-4 flex flex-col gap-2 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              const notes = String(fd.get("notes") ?? "").trim();
              const result = String(fd.get("result") ?? "Pass") as "Pass" | "Fail";
              addLog({ style: styleId, result, notes });
              e.currentTarget.reset();
            }}
          >
            <select
              name="result"
              className="h-11 rounded-md border border-input bg-muted px-3 text-sm"
              defaultValue="Pass"
            >
              <option value="Pass">通过</option>
              <option value="Fail">未过</option>
            </select>
            <input
              name="notes"
              placeholder="备注：时段、风格、失败原因"
              className="h-11 flex-1 rounded-md border border-input bg-muted px-3 text-sm"
            />
            <Button type="submit">记一笔</Button>
          </form>
          <ul className="mt-3 space-y-2">
            {logs.map((log) => (
              <li
                key={log.id}
                className="flex items-start justify-between gap-3 rounded-md border border-border bg-card px-3 py-2"
              >
                <div>
                  <div className="text-sm">
                    {log.result === "Pass" ? "通过" : "未过"} · {log.style}
                  </div>
                  {log.notes ? (
                    <div className="text-xs text-muted-foreground">{log.notes}</div>
                  ) : null}
                </div>
                <button
                  type="button"
                  className="rounded-md p-2 text-muted-foreground hover:text-foreground"
                  onClick={() => deleteLog(log.id)}
                  aria-label="删除"
                >
                  <Trash2 className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <aside className="space-y-3 self-start lg:sticky lg:top-20">
        <h2 className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
          手册要点
        </h2>
        {PRINCIPLES.map((p) => (
          <article key={p.title} className="rounded-lg border border-border bg-card p-4">
            <h3 className="text-sm font-medium">{p.title}</h3>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{p.text}</p>
          </article>
        ))}
        <p className="px-1 text-[11px] text-muted-foreground">
          社区工具，非正式 xAI 软件。结构参考公开的 Imagine 提示词工坊做法。
        </p>
      </aside>
    </div>
  );
}
