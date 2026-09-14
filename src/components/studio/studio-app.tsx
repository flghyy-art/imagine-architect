import { useEffect, useState } from "react";
import { BookOpen, Clapperboard, LayoutTemplate, MessageSquare, PenLine, Sparkles } from "lucide-react";
import { Toaster } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStudio } from "@/lib/store";
import { BuilderPanel } from "./builder-panel";
import { ChatPanel } from "./chat-panel";
import { ComposeDialog } from "./compose-dialog";
import { GalleryPanel } from "./gallery-panel";
import { SequencePanel } from "./sequence-panel";
import { TemplatesPanel } from "./templates-panel";

export function StudioApp() {
  const [tab, setTab] = useState("dialog");
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    void useStudio.persist.rehydrate();
  }, []);

  return (
    <div className="relative min-h-dvh bg-background text-foreground">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[linear-gradient(180deg,color-mix(in_oklab,var(--color-foreground)_6%,transparent),transparent)]"
      />
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
          <div className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-md border border-border bg-card font-display text-lg leading-none">
              /
            </div>
            <div>
              <h1 className="font-display text-lg leading-none tracking-tight">Imagine Architect</h1>
              <p className="mt-0.5 text-[11px] text-muted-foreground">Grok Imagine 提示词工坊</p>
            </div>
          </div>
          <Button onClick={() => setDialogOpen(true)} className="shrink-0">
            <PenLine className="size-4" />
            <span className="hidden sm:inline">打开对话框</span>
            <span className="sm:hidden">对话框</span>
          </Button>
        </div>
      </header>

      <main className="relative mx-auto flex max-w-6xl flex-col px-4 pb-16 pt-6 sm:pt-8">
        <section className="mb-8 max-w-2xl">
          <p className="font-display text-3xl leading-tight tracking-tight sm:text-4xl">
            用对话写出能直接粘贴的电影级提示词。
          </p>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            描述画面，自动叠风格、镜头、光影与画幅。复制到 Grok Imagine，或在工坊里直接出一张静帧。
          </p>
        </section>

        <Tabs value={tab} onValueChange={setTab} className="flex min-h-0 flex-col">
          <TabsList className="mb-6">
            <TabsTrigger value="dialog">
              <MessageSquare className="size-3.5 max-sm:hidden" />
              对话
            </TabsTrigger>
            <TabsTrigger value="builder">
              <Sparkles className="size-3.5 max-sm:hidden" />
              组装
            </TabsTrigger>
            <TabsTrigger value="sequence">
              <Clapperboard className="size-3.5 max-sm:hidden" />
              分镜
            </TabsTrigger>
            <TabsTrigger value="templates">
              <LayoutTemplate className="size-3.5 max-sm:hidden" />
              模板
            </TabsTrigger>
            <TabsTrigger value="gallery">
              <BookOpen className="size-3.5 max-sm:hidden" />
              图库
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dialog" className="flex min-h-[70dvh] flex-col">
            <ChatPanel />
          </TabsContent>
          <TabsContent value="builder">
            <BuilderPanel />
          </TabsContent>
          <TabsContent value="sequence">
            <SequencePanel />
          </TabsContent>
          <TabsContent value="templates">
            <TemplatesPanel onLoaded={() => setTab("builder")} />
          </TabsContent>
          <TabsContent value="gallery">
            <GalleryPanel />
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t border-border py-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 text-[11px] text-muted-foreground">
          <p>社区工具 · 非正式 xAI 软件</p>
          <p>电影级构图 · 成年角色</p>
        </div>
      </footer>

      <ComposeDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      <Toaster
        theme="dark"
        position="bottom-center"
        toastOptions={{
          className: "bg-card text-foreground border-border",
        }}
      />
    </div>
  );
}
