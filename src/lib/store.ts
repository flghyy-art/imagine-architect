import { create } from "zustand";
import { persist } from "zustand/middleware";
import { TEMPLATES, type AspectRatio, type Template } from "./catalog";
import { composePrompt } from "./prompt-engine";

export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  text: string;
  prompt?: string;
  imageUrl?: string;
  createdAt: number;
};

export type GalleryItem = {
  id: string;
  prompt: string;
  imageUrl: string;
  createdAt: number;
};

export type LogItem = {
  id: string;
  style: string;
  result: "Pass" | "Fail";
  notes: string;
  createdAt: number;
};

export type StudioState = {
  styleId: string;
  boosterIds: string[];
  quality: boolean;
  continuity: boolean;
  audio: boolean;
  voiceId: string;
  aspectRatio: AspectRatio;
  subject: string;
  sequenceBase: string;
  messages: ChatMessage[];
  gallery: GalleryItem[];
  logs: LogItem[];
  setStyle: (id: string) => void;
  toggleBooster: (id: string) => void;
  setQuality: (v: boolean) => void;
  setContinuity: (v: boolean) => void;
  setAudio: (v: boolean) => void;
  setVoice: (id: string) => void;
  setAspectRatio: (v: AspectRatio) => void;
  setSubject: (v: string) => void;
  insertBlock: (text: string) => void;
  setSequenceBase: (v: string) => void;
  loadTemplate: (t: Template) => void;
  addMessage: (msg: ChatMessage) => void;
  patchMessage: (id: string, patch: Partial<ChatMessage>) => void;
  clearChat: () => void;
  addGallery: (item: GalleryItem) => void;
  addLog: (item: Omit<LogItem, "id" | "createdAt">) => void;
  deleteLog: (id: string) => void;
  resetComposer: () => void;
};

export const useStudio = create<StudioState>()(
  persist(
    (set) => ({
      styleId: "anime",
      boosterIds: ["cinema"],
      quality: true,
      continuity: false,
      audio: false,
      voiceId: "score",
      aspectRatio: "16:9",
      subject: "",
      sequenceBase: "",
      messages: [
        {
          id: "welcome",
          role: "assistant",
          text: "用一句话描述画面。我会按电影级结构组装 Grok Imagine 提示词，可复制到 Imagine，也可以直接出图。",
          createdAt: Date.now(),
        },
      ],
      gallery: [],
      logs: [],
      setStyle: (styleId) => set({ styleId }),
      toggleBooster: (id) =>
        set((s) => ({
          boosterIds: s.boosterIds.includes(id)
            ? s.boosterIds.filter((x) => x !== id)
            : [...s.boosterIds, id],
        })),
      setQuality: (quality) => set({ quality }),
      setContinuity: (continuity) => set({ continuity }),
      setAudio: (audio) => set({ audio }),
      setVoice: (voiceId) => set({ voiceId }),
      setAspectRatio: (aspectRatio) => set({ aspectRatio }),
      setSubject: (subject) => set({ subject }),
      insertBlock: (text) =>
        set((s) => ({
          subject: s.subject ? `${s.subject.trim()} ${text}` : text,
        })),
      setSequenceBase: (sequenceBase) => set({ sequenceBase }),
      loadTemplate: (t) =>
        set({
          styleId: t.styleId,
          boosterIds: t.boosters,
          audio: t.audio,
          continuity: t.continuity,
          subject: t.subject,
        }),
      addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
      patchMessage: (id, patch) =>
        set((s) => ({
          messages: s.messages.map((m) => (m.id === id ? { ...m, ...patch } : m)),
        })),
      clearChat: () =>
        set({
          messages: [
            {
              id: "welcome",
              role: "assistant",
              text: "对话已清空。再描述一个画面即可。",
              createdAt: Date.now(),
            },
          ],
        }),
      addGallery: (item) =>
        set((s) => ({ gallery: [item, ...s.gallery].slice(0, 24) })),
      addLog: (item) =>
        set((s) => ({
          logs: [
            { ...item, id: crypto.randomUUID(), createdAt: Date.now() },
            ...s.logs,
          ].slice(0, 80),
        })),
      deleteLog: (id) => set((s) => ({ logs: s.logs.filter((l) => l.id !== id) })),
      resetComposer: () =>
        set({
          subject: "",
          continuity: false,
          audio: false,
          boosterIds: ["cinema"],
        }),
    }),
    {
      name: "imagine-architect-v1",
      skipHydration: true,
      partialize: (s) => ({
        styleId: s.styleId,
        boosterIds: s.boosterIds,
        quality: s.quality,
        continuity: s.continuity,
        audio: s.audio,
        voiceId: s.voiceId,
        aspectRatio: s.aspectRatio,
        subject: s.subject,
        sequenceBase: s.sequenceBase,
        messages: s.messages.slice(-40),
        gallery: s.gallery,
        logs: s.logs,
      }),
    },
  ),
);

export function currentPrompt(): string {
  const s = useStudio.getState();
  return composePrompt({
    styleId: s.styleId,
    boosterIds: s.boosterIds,
    quality: s.quality,
    continuity: s.continuity,
    subject: s.subject,
    audio: s.audio,
    voiceId: s.voiceId,
    aspectRatio: s.aspectRatio,
  });
}

export function findTemplate(id: string) {
  return TEMPLATES.find((t) => t.id === id);
}
