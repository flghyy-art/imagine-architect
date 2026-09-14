import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { TEMPLATES, TEMPLATE_CATEGORIES } from "@/lib/catalog";
import { useStudio } from "@/lib/store";
import { cn } from "@/lib/utils";

export function TemplatesPanel({ onLoaded }: { onLoaded?: () => void }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("全部");
  const loadTemplate = useStudio((s) => s.loadTemplate);

  const list = useMemo(() => {
    const query = q.trim().toLowerCase();
    return TEMPLATES.filter((t) => {
      if (cat !== "全部" && t.category !== cat) return false;
      if (!query) return true;
      return (
        t.name.toLowerCase().includes(query) ||
        t.nameEn.toLowerCase().includes(query) ||
        t.subject.toLowerCase().includes(query) ||
        t.blurb.toLowerCase().includes(query)
      );
    });
  }, [q, cat]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={`搜索 ${TEMPLATES.length} 条电影级模板`}
            className="pl-9"
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {TEMPLATE_CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCat(c)}
            className={cn(
              "h-9 rounded-full border px-3 text-xs",
              cat === c
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:text-foreground",
            )}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {list.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => {
              loadTemplate(t);
              toast(`已载入「${t.name}」`);
              onLoaded?.();
            }}
            className="rounded-lg border border-border bg-card p-4 text-left transition-colors hover:border-input hover:bg-accent"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-medium text-foreground">{t.name}</div>
                <div className="font-mono text-[11px] text-muted-foreground">{t.nameEn}</div>
              </div>
              <Badge>{t.type}</Badge>
            </div>
            <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
              {t.blurb} {t.subject}
            </p>
            <div className="mt-3 text-[11px] text-muted-foreground">{t.category}</div>
          </button>
        ))}
        {list.length === 0 ? (
          <div className="col-span-full py-12 text-center text-sm text-muted-foreground">
            没有匹配的模板
          </div>
        ) : null}
      </div>
    </div>
  );
}
