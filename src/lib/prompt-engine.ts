import {
  ART_STYLES,
  AUDIO_BLOCK,
  BOOSTER_BY_ID,
  CONTINUITY_LOCK,
  QUALITY_PREFIX,
  STYLE_BY_ID,
  VOICES,
  type AspectRatio,
} from "./catalog";

export type PromptInput = {
  styleId: string;
  boosterIds: string[];
  quality: boolean;
  continuity: boolean;
  subject: string;
  audio: boolean;
  voiceId: string;
  aspectRatio: AspectRatio;
};

export type PromptParts = {
  style: string;
  boosters: string[];
  quality?: string;
  continuity?: string;
  subject: string;
  audio?: string;
  aspect: string;
};

export function buildParts(input: PromptInput): PromptParts {
  const style = STYLE_BY_ID[input.styleId]?.prompt ?? ART_STYLES[0].prompt;
  const boosters = input.boosterIds
    .map((id) => BOOSTER_BY_ID[id]?.prompt)
    .filter((p): p is string => Boolean(p));
  const voice = VOICES.find((v) => v.id === input.voiceId)?.prompt ?? VOICES[0].prompt;
  const subject = input.subject.trim();

  return {
    style,
    boosters,
    quality: input.quality ? QUALITY_PREFIX : undefined,
    continuity: input.continuity ? CONTINUITY_LOCK : undefined,
    subject,
    audio: input.audio ? `${AUDIO_BLOCK} ${voice}` : undefined,
    aspect: `--ar ${input.aspectRatio}`,
  };
}

export function composeRaw(parts: PromptParts): string {
  const chunks = [
    parts.style,
    ...parts.boosters,
    parts.quality,
    parts.continuity,
    parts.subject || undefined,
    parts.audio,
  ].filter(Boolean) as string[];
  return `${chunks.join(", ")} ${parts.aspect}`;
}

export function composePrompt(input: PromptInput): string {
  return composeRaw(buildParts(input));
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const area = document.createElement("textarea");
      area.value = text;
      area.style.position = "fixed";
      area.style.left = "-9999px";
      document.body.appendChild(area);
      area.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(area);
      return ok;
    } catch {
      return false;
    }
  }
}
