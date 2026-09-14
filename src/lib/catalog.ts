export type ArtStyle = {
  id: string;
  label: string;
  hint: string;
  prompt: string;
};

export type Booster = {
  id: string;
  label: string;
  prompt: string;
};

export type ShotChip = {
  id: string;
  label: string;
  text: string;
};

export type Template = {
  id: string;
  number: number;
  name: string;
  nameEn: string;
  category: string;
  type: "Image" | "Video" | "Both";
  styleId: string;
  boosters: string[];
  audio: boolean;
  continuity: boolean;
  subject: string;
  blurb: string;
};

export const ART_STYLES: ArtStyle[] = [
  {
    id: "anime",
    label: "动漫电影",
    hint: "成功率最高",
    prompt: "ultra-detailed cinematic anime, 8K, clean linework, rich cel shading",
  },
  {
    id: "dark-fantasy",
    label: "暗黑奇幻",
    hint: "哥特氛围",
    prompt: "dark fantasy cinematic anime, gothic candlelight, ornate shadows, 8K",
  },
  {
    id: "semi-real",
    label: "半写实",
    hint: "插画质感",
    prompt: "semi-realistic cinematic illustration, painterly brushwork, 8K",
  },
  {
    id: "photoreal",
    label: "摄影写实",
    hint: "较难通过",
    prompt: "hyperrealistic natural photography, 8K, physically accurate light",
  },
  {
    id: "oil",
    label: "油画",
    hint: "笔触纹理",
    prompt: "classical oil painting, visible impasto brushwork, museum lighting",
  },
  {
    id: "noir",
    label: "黑色电影",
    hint: "硬光阴影",
    prompt: "classic noir cinematography, hard key light, deep blacks, 35mm grain",
  },
];

export const STYLE_BOOSTERS: Booster[] = [
  {
    id: "volumetric",
    label: "体积光",
    prompt: "volumetric lighting, dramatic rim light, god rays, ray-traced atmosphere",
  },
  {
    id: "cinema",
    label: "电影景深",
    prompt: "shallow depth of field, anamorphic bokeh, cinematic framing, perfect composition",
  },
  {
    id: "gothic",
    label: "哥特气氛",
    prompt: "gothic atmosphere, dark candlelight, mysterious shadows, deep blacks",
  },
  {
    id: "neon",
    label: "霓虹",
    prompt: "neon glow, wet reflective streets, high saturation accent lights, night rain",
  },
  {
    id: "romantic",
    label: "柔焦",
    prompt: "soft focus, pastel bloom, dreamy atmosphere, gentle diffusion",
  },
  {
    id: "texture",
    label: "材质特写",
    prompt: "tactile surface detail, fabric weave, skin pores restrained, micro-contrast",
  },
];

export const ASPECT_RATIOS = ["16:9", "9:16", "1:1", "2:3", "3:2"] as const;
export type AspectRatio = (typeof ASPECT_RATIOS)[number];

export const VOICES = [
  { id: "score", label: "管弦配乐", prompt: "lush orchestral score, no lyrics" },
  { id: "ambient", label: "环境声场", prompt: "immersive environmental ambience and foley" },
  { id: "hushed", label: "低语对白", prompt: "hushed natural dialogue, close-mic breath, quiet room tone" },
  { id: "pulse", label: "节奏脉冲", prompt: "low rhythmic pulse, distant percussion, tension ostinato" },
] as const;

export const QUALITY_PREFIX =
  "cinematic masterpiece, coherent adult anatomy and hands, physically plausible lighting, high production value, no watermark, no on-screen text";

export const CONTINUITY_LOCK =
  "seamless continuation from the previous frame, preserve identical faces, wardrobe, body proportions, color grade and lens language";

export const AUDIO_BLOCK =
  "immersive cinematic sound design, synced foley and environmental ambience, score swell at the dramatic peak, gentle decay on the last beat. Custom mix:";

export const PHASE_BLOCKS = {
  SETUP:
    "establishing shot, geography and lighting locked, mood introduced, characters placed with clear spatial relationships",
  BUILD:
    "camera pushes closer, motion and tension rise, blocking tightens, practical lights flare across faces",
  PEAK:
    "dramatic climax, peak motion and emotion, light flare, decisive gesture held for a beat",
  RESOLVE:
    "lingering hold, aftermath, breath returns, emotional landing in a quiet frame",
};

export const SHOT_CHIPS: ShotChip[] = [
  { id: "ecu", label: "大特写", text: "extreme close-up, 85mm, catchlights in the eyes" },
  { id: "est", label: "建立镜头", text: "wide establishing shot, 24mm, layered foreground" },
  { id: "ots", label: "过肩", text: "over-the-shoulder, intimate blocking, shallow focus" },
  { id: "low", label: "仰拍英雄", text: "low angle hero shot, monumental framing" },
  { id: "track", label: "跟踪", text: "smooth tracking shot, grounded camera move" },
  { id: "dolly", label: "缓推", text: "slow dolly-in, tension rising with the move" },
  { id: "aerial", label: "航拍", text: "aerial descending shot, weather and scale" },
  { id: "rain", label: "镜头雨滴", text: "rain on the lens, wet highlights, practical street lamps" },
  { id: "candle", label: "烛光实践", text: "warm practical candlelight, falloff into shadow" },
  { id: "anamorphic", label: "变形宽银幕", text: "anamorphic 2.39, horizontal flares, cinematic squeeze" },
  { id: "golden", label: "黄金时刻", text: "golden hour sidelight, long shadows, warm rim" },
  { id: "silhouette", label: "剪影", text: "backlit silhouette, readable outline, rich negative space" },
];

export const PRINCIPLES = [
  {
    title: "风格优先",
    text: "动漫电影与风格化画面通过率最高。摄影写实最容易被判定为真人，成功率明显更低。",
  },
  {
    title: "镜头语言",
    text: "写清焦段、机位、运动和光的方向。Imagine 对具体摄影指令的响应比形容词堆砌更好。",
  },
  {
    title: "连续性",
    text: "做分镜时第一镜锁定脸、服装、比例和调色，后续镜头只改变动作与机位。",
  },
  {
    title: "视频声画",
    text: "视频提示词补上声画同步：环境声、拟音、配乐起伏。静态图可关掉音频层。",
  },
  {
    title: "四段弧线",
    text: "建立 → 推进 → 高潮 → 收束。每段只加一层变化，避免一次写完整部电影。",
  },
];

export const TEMPLATES: Template[] = [
  {
    id: "rain-window",
    number: 1,
    name: "暴雨窗前",
    nameEn: "Rain-Streaked Window",
    category: "人像",
    type: "Both",
    styleId: "anime",
    boosters: ["cinema", "volumetric"],
    audio: true,
    continuity: false,
    subject:
      "a young adult woman in a dark wool coat stands at a rain-streaked window, city neon fracturing through water, quiet resolve in her eyes, 85mm close-up",
    blurb: "最稳的开场：雨、玻璃、眼神。",
  },
  {
    id: "fireplace",
    number: 2,
    name: "壁炉侧影",
    nameEn: "Fireplace Silhouette",
    category: "人像",
    type: "Video",
    styleId: "noir",
    boosters: ["gothic", "cinema"],
    audio: true,
    continuity: false,
    subject:
      "two adults sit across a low table by a stone fireplace, firelight carving silhouettes, a pause in conversation, slow camera drift",
    blurb: "剪影与实践光，适合情绪戏。",
  },
  {
    id: "rooftop",
    number: 3,
    name: "屋顶黄昏",
    nameEn: "Rooftop Sunset",
    category: "都市",
    type: "Both",
    styleId: "semi-real",
    boosters: ["cinema", "romantic"],
    audio: false,
    continuity: false,
    subject:
      "wide rooftop at sunset, skyline haze, a young adult couple standing at the parapet with wind in their coats, long lens compression",
    blurb: "城市尺度 + 人物关系。",
  },
  {
    id: "cyber-alley",
    number: 4,
    name: "赛博雨巷",
    nameEn: "Neon Rain Alley",
    category: "科幻",
    type: "Video",
    styleId: "anime",
    boosters: ["neon", "volumetric"],
    audio: true,
    continuity: false,
    subject:
      "a young adult detective in a long coat walks a rain-soaked neon alley, holographic signs reflected in puddles, steam vents, tracking shot from behind",
    blurb: "霓虹、雨水、跟踪镜头。",
  },
  {
    id: "throne",
    number: 5,
    name: "暗黑王座",
    nameEn: "Dark Throne",
    category: "奇幻",
    type: "Image",
    styleId: "dark-fantasy",
    boosters: ["gothic", "volumetric"],
    audio: false,
    continuity: false,
    subject:
      "an adult sovereign seated on an obsidian throne in a cathedral hall, candlelit columns receding into fog, low angle monumental framing",
    blurb: "哥特体积光，低机位。",
  },
  {
    id: "bridge",
    number: 6,
    name: "舰桥星图",
    nameEn: "Starship Bridge",
    category: "科幻",
    type: "Both",
    styleId: "semi-real",
    boosters: ["cinema", "volumetric"],
    audio: true,
    continuity: false,
    subject:
      "adult crew on a quiet starship bridge, holographic star chart blooming in the dark, cool panel light on faces, slow push-in",
    blurb: "冷光界面与人物层次。",
  },
  {
    id: "duel",
    number: 7,
    name: "剑斗尘土",
    nameEn: "Sword Duel",
    category: "动作",
    type: "Video",
    styleId: "dark-fantasy",
    boosters: ["cinema", "texture"],
    audio: true,
    continuity: false,
    subject:
      "two adult swordsmen clash in a dry courtyard, dust exploding at their feet, fabric and hair frozen mid-motion, 120fps feel, side tracking",
    blurb: "动作高潮，尘土与冻结瞬间。",
  },
  {
    id: "kitchen",
    number: 8,
    name: "晨光厨房",
    nameEn: "Morning Kitchen",
    category: "都市",
    type: "Image",
    styleId: "semi-real",
    boosters: ["romantic", "cinema"],
    audio: false,
    continuity: false,
    subject:
      "sunlit kitchen, steam from a kettle, an adult leaning on the counter with a mug, window light wrapping the face, documentary stillness",
    blurb: "生活流，窗光。",
  },
  {
    id: "harbor",
    number: 9,
    name: "港口月色",
    nameEn: "Harbor Moonlight",
    category: "自然",
    type: "Both",
    styleId: "oil",
    boosters: ["cinema", "volumetric"],
    audio: true,
    continuity: false,
    subject:
      "moonlit harbor, wet dock boards, an adult standing at the edge with coat collar up, silver path on the water, quiet hold",
    blurb: "冷月光与水面路径。",
  },
  {
    id: "portrait",
    number: 10,
    name: "油画肖像",
    nameEn: "Oil Portrait",
    category: "人像",
    type: "Image",
    styleId: "oil",
    boosters: ["texture", "gothic"],
    audio: false,
    continuity: false,
    subject:
      "museum-grade oil portrait of an adult with a thoughtful gaze, Rembrandt lighting, dark ground, visible impasto on the collar",
    blurb: "伦勃朗光，笔触可见。",
  },
  {
    id: "academy",
    number: 11,
    name: "学院屋顶",
    nameEn: "Academy Rooftop",
    category: "人像",
    type: "Image",
    styleId: "anime",
    boosters: ["cinema", "romantic"],
    audio: false,
    continuity: false,
    subject:
      "a young adult in a stylized academy uniform on a windy rooftop after class, city below, hair and ribbon caught in the wind, golden sidelight",
    blurb: "动漫人像标准构图。",
  },
  {
    id: "highway",
    number: 12,
    name: "公路夜车",
    nameEn: "Night Highway",
    category: "都市",
    type: "Video",
    styleId: "noir",
    boosters: ["neon", "cinema"],
    audio: true,
    continuity: false,
    subject:
      "night highway from the passenger seat, dashboard glow on an adult driver's face, taillights streaking, rain on windshield, locked-off camera",
    blurb: "车内视角，光轨。",
  },
  {
    id: "library",
    number: 13,
    name: "图书馆光柱",
    nameEn: "Library God Rays",
    category: "都市",
    type: "Image",
    styleId: "semi-real",
    boosters: ["volumetric", "cinema"],
    audio: false,
    continuity: false,
    subject:
      "vast library nave, dust in cathedral god rays, an adult at a long table with open books, quiet scale",
    blurb: "体积光教科书。",
  },
  {
    id: "snow",
    number: 14,
    name: "雪原旅人",
    nameEn: "Snow Traveler",
    category: "自然",
    type: "Both",
    styleId: "dark-fantasy",
    boosters: ["cinema", "volumetric"],
    audio: true,
    continuity: false,
    subject:
      "lone adult traveler crossing a white waste, dark cloak against blizzard, distant ruin, aerial descending into the figure",
    blurb: "尺度对比与恶劣天气。",
  },
  {
    id: "opera",
    number: 15,
    name: "歌剧院包厢",
    nameEn: "Opera Box",
    category: "人像",
    type: "Image",
    styleId: "oil",
    boosters: ["gothic", "cinema"],
    audio: false,
    continuity: false,
    subject:
      "adult in an opera box, velvet and gold leaf, stage light spilling from below, profile catchlight, hushed opulence",
    blurb: "自下而上的舞台光。",
  },
  {
    id: "underwater",
    number: 16,
    name: "水下光斑",
    nameEn: "Underwater Caustics",
    category: "自然",
    type: "Video",
    styleId: "semi-real",
    boosters: ["volumetric", "cinema"],
    audio: true,
    continuity: false,
    subject:
      "an adult swimmer suspended in clear water, caustic light on skin and fabric, slow motes, camera drifting past",
    blurb: "焦散与失重。",
  },
  {
    id: "western",
    number: 17,
    name: "西部正午",
    nameEn: "Western Noon",
    category: "动作",
    type: "Image",
    styleId: "photoreal",
    boosters: ["texture", "cinema"],
    audio: false,
    continuity: false,
    subject:
      "high-noon western street, hard overhead sun, an adult standing in the dust with a long coat, deep eye sockets, heat haze",
    blurb: "硬光正午，写实挑战。",
  },
  {
    id: "mecha",
    number: 18,
    name: "机甲检修",
    nameEn: "Mecha Hangar",
    category: "科幻",
    type: "Both",
    styleId: "anime",
    boosters: ["volumetric", "texture"],
    audio: true,
    continuity: false,
    subject:
      "colossal mecha under repair in a hangar, adult technician on a gantry, spark showers, industrial scale, low angle",
    blurb: "工业尺度与人物。",
  },
  {
    id: "bamboo",
    number: 19,
    name: "竹林剑客",
    nameEn: "Bamboo Swordsman",
    category: "动作",
    type: "Video",
    styleId: "anime",
    boosters: ["cinema", "volumetric"],
    audio: true,
    continuity: false,
    subject:
      "adult swordsman walking a bamboo corridor, shafts of light, leaves in slow motion, tracking beside them, wuxia stillness before the cut",
    blurb: "武侠建立段。",
  },
  {
    id: "detective",
    number: 20,
    name: "雨夜侦探",
    nameEn: "Noir Detective",
    category: "都市",
    type: "Image",
    styleId: "noir",
    boosters: ["gothic", "cinema"],
    audio: false,
    continuity: false,
    subject:
      "adult detective under a streetlamp in heavy rain, fedora brim shadowing the eyes, wet asphalt speculars, venetian-blind motif in a nearby window",
    blurb: "黑色电影母题。",
  },
  {
    id: "temple",
    number: 21,
    name: "山寺晨钟",
    nameEn: "Mountain Temple",
    category: "自然",
    type: "Image",
    styleId: "oil",
    boosters: ["volumetric", "romantic"],
    audio: false,
    continuity: false,
    subject:
      "mountain temple at first light, incense smoke in the courtyard, an adult monk ringing a bronze bell, mist in the pines",
    blurb: "晨雾与仪式感。",
  },
  {
    id: "editorial",
    number: 22,
    name: "时装大片",
    nameEn: "Fashion Editorial",
    category: "人像",
    type: "Image",
    styleId: "photoreal",
    boosters: ["cinema", "texture"],
    audio: false,
    continuity: false,
    subject:
      "high-fashion editorial of an adult model in structured tailoring against concrete, hard beauty light, architectural negative space",
    blurb: "时装硬光，结构服装。",
  },
  {
    id: "train",
    number: 23,
    name: "列车走廊",
    nameEn: "Train Corridor",
    category: "都市",
    type: "Video",
    styleId: "anime",
    boosters: ["cinema", "neon"],
    audio: true,
    continuity: false,
    subject:
      "night train corridor, sequential window lights strobing across an adult passenger's face, handheld-stable tracking, quiet tension",
    blurb: "节奏光斑，过道跟踪。",
  },
  {
    id: "observatory",
    number: 24,
    name: "天文台圆顶",
    nameEn: "Observatory Dome",
    category: "科幻",
    type: "Both",
    styleId: "semi-real",
    boosters: ["volumetric", "cinema"],
    audio: true,
    continuity: false,
    subject:
      "open observatory dome under the milky way, adult astronomer beside a brass telescope, cold starlight and a single warm lamp",
    blurb: "星空尺度，一点暖光。",
  },
];

export const TEMPLATE_CATEGORIES = [
  "全部",
  ...Array.from(new Set(TEMPLATES.map((t) => t.category))),
];

export const STYLE_BY_ID = Object.fromEntries(ART_STYLES.map((s) => [s.id, s]));
export const BOOSTER_BY_ID = Object.fromEntries(STYLE_BOOSTERS.map((b) => [b.id, b]));
