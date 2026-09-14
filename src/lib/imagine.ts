import { createServerFn } from "@tanstack/react-start";

const MINOR_RE =
  /\b(child|children|kid|kids|minor|minors|underage|preteen|toddler|infant|loli|shota|csam)\b/i;

type ExpandOk = { ok: true; subject: string };
type ExpandErr = { ok: false; error: string };
export type ExpandResult = ExpandOk | ExpandErr;

type ImageOk = { ok: true; url: string };
type ImageErr = { ok: false; error: string };
export type ImageResult = ImageOk | ImageErr;

export const expandScene = createServerFn({ method: "POST" })
  .validator((input: { brief: string; styleHint: string }) => input)
  .handler(async ({ data }): Promise<ExpandResult> => {
    const brief = data.brief.trim().slice(0, 800);
    if (!brief) return { ok: false, error: "请先描述画面。" };
    if (MINOR_RE.test(brief)) {
      return { ok: false, error: "画面需为成年角色。请改写后再试。" };
    }

    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      return { ok: true, subject: brief };
    }

    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-4.5",
        temperature: 0.6,
        max_tokens: 280,
        messages: [
          {
            role: "system",
            content:
              "You are a Grok Imagine prompt architect. Rewrite the user's scene into ONE dense English cinematic subject clause (no style preface, no aspect ratio). Include subject, wardrobe, setting, lens/camera, lighting, and mood. Adults only. No sexual or pornographic content, no nudity, no real celebrities. Output ONLY the subject clause.",
          },
          {
            role: "user",
            content: `Art direction hint: ${data.styleHint}\nScene: ${brief}`,
          },
        ],
      }),
    });

    if (!res.ok) {
      return { ok: true, subject: brief };
    }

    const body = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const text = body.choices?.[0]?.message?.content?.trim();
    if (!text) return { ok: true, subject: brief };
    if (MINOR_RE.test(text)) {
      return { ok: false, error: "画面需为成年角色。请改写后再试。" };
    }
    return { ok: true, subject: text.replace(/^["']|["']$/g, "") };
  });

export const generateImage = createServerFn({ method: "POST" })
  .validator((input: { prompt: string; aspectRatio: string }) => input)
  .handler(async ({ data }): Promise<ImageResult> => {
    const prompt = data.prompt.trim().slice(0, 2500);
    if (!prompt) return { ok: false, error: "提示词为空。" };
    if (MINOR_RE.test(prompt)) {
      return { ok: false, error: "画面需为成年角色。请改写后再试。" };
    }

    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      return { ok: false, error: "当前环境暂未开通 Imagine 出图。" };
    }

    const res = await fetch("https://api.x.ai/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-imagine-image-2.0",
        prompt,
        n: 1,
        aspect_ratio: data.aspectRatio,
        resolution: "1k",
      }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      if (res.status === 400 && data.aspectRatio) {
        const retry = await fetch("https://api.x.ai/v1/images/generations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "grok-imagine-image-2.0",
            prompt,
            n: 1,
          }),
        });
        if (retry.ok) {
          return parseImage(await retry.json());
        }
      }
      return {
        ok: false,
        error: `出图失败（${res.status}）。${shortErr(errText)}`,
      };
    }

    return parseImage(await res.json());
  });

function parseImage(body: unknown): ImageResult {
  const rec = body as {
    data?: { url?: string; b64_json?: string }[];
    url?: string;
  };
  const first = rec.data?.[0];
  if (first?.url) return { ok: true, url: first.url };
  if (rec.url) return { ok: true, url: rec.url };
  if (first?.b64_json) {
    return { ok: true, url: `data:image/png;base64,${first.b64_json}` };
  }
  return { ok: false, error: "接口未返回图片。" };
}

function shortErr(raw: string) {
  const t = raw.replace(/\s+/g, " ").trim();
  return t.slice(0, 140);
}
