export interface Project {
  id: string;
  title: string;
  subtitle: string;
  category: '3D & Motion' | 'UI/UX & Product' | 'Brand & Identity' | 'Typography & Visual';
  tag: string;
  year: string;
  role: string;
  client: string;
  thumbnail: {
    type: 'synth' | 'kinetic-type' | 'character' | 'geometric' | 'dashboard' | 'spatial';
    bgColor: string;
    accentColor: string;
    badge: string;
  };
  summary: string;
  description: string;
  challenge: string;
  solution: string;
  impact: string;
  tools: string[];
  colorPalette: string[];
  metrics: { label: string; value: string }[];
  galleryItems: {
    title: string;
    caption: string;
    color: string;
    type: 'visual' | 'code' | '3d' | 'stats';
  }[];
  externalLink?: string;
  featured?: boolean;
}

export const projectsData: Project[] = [
  {
    id: 'voltix-synth',
    title: 'VOLTIX Audio Modules',
    subtitle: 'Tactile Analog Hardware & Generative Synth System',
    category: '3D & Motion',
    tag: '3D Hardware / UI',
    year: '2026',
    role: 'Lead 3D & Industrial UI Designer',
    client: 'Voltix Sound Lab',
    featured: true,
    thumbnail: {
      type: 'synth',
      bgColor: '#1E2026',
      accentColor: '#FFC83B',
      badge: 'Hardware 3D',
    },
    summary: '一款結合復古音訊踏板 (Pedal Synth) 與當代微擬物軟體介面的模組化合成器設計。',
    description: 'VOLTIX 專案旨在打破數位合成器冰冷的螢幕操作感，將實體踏板的觸感回饋、霧面磨砂材質、圓柱旋鈕與動態波形燈條完美融合，打造一組兼具實體收藏價值與數位生成聲音工作站的多維度產品。',
    challenge: '如何在虛擬介面中還原實體旋鈕的「阻尼感」與彈簧按鈕的「行程反饋」，並使每個模組在便當盒網格中具備高度辨識度。',
    solution: '運用 Blender + Three.js 烘焙高精度光影與磨砂法線貼圖，結合 Web Audio API 實現即時聲音合成與視覺波形同步回饋。',
    impact: '獲得 2026 Red Dot Design Concept 入圍，Kickstarter 首批預購於 48 小時內達成 320% 目標。',
    tools: ['Blender 4.2', 'Spline 3D', 'Three.js', 'Figma', 'Web Audio API'],
    colorPalette: ['#FFC83B', '#8B72DE', '#E75A45', '#588177', '#23262D'],
    metrics: [
      { label: '募資達成率', value: '320%' },
      { label: '互動延遲', value: '< 12ms' },
      { label: '設計獎項', value: 'Red Dot 2026' }
    ],
    galleryItems: [
      {
        title: 'Tactile Modulators & Stepper Dials',
        caption: '微擬物步進旋鈕與多段式濾波器物理按鍵渲染',
        color: '#8B72DE',
        type: '3d'
      },
      {
        title: 'Matte Coral & Mustard Modules',
        caption: '低飽和度暖色調材質搭配陽極氧化鋁外框細節',
        color: '#E75A45',
        type: 'visual'
      },
      {
        title: 'Web Audio Oscillator Engine',
        caption: '可調諧雙核心震盪器即時運算架構',
        color: '#588177',
        type: 'code'
      }
    ]
  },
  {
    id: 'kinetic-grotesk',
    title: 'KILOY Kinetic Specimen',
    subtitle: 'Chunky Variable Typeface & Interactive Playground',
    category: 'Typography & Visual',
    tag: 'Typography / Motion',
    year: '2025',
    role: 'Typeface Designer & Creative Developer',
    client: 'Marva Kinetic Foundry',
    featured: true,
    thumbnail: {
      type: 'kinetic-type',
      bgColor: '#121316',
      accentColor: '#FFFFFF',
      badge: 'Type Specimen',
    },
    summary: '具備極致張力與動態流動感的超粗體展示字型 (Chunky Kinetic Typeface)。',
    description: 'KILOY 是一套致敬 1970 摩登主義海報與當代 Y2K 龐克動態的實驗性可變字體 (Variable Font)。透過軸向動畫讓字型筆畫在膨脹、扭曲與幾何收縮間自由切換。',
    challenge: '在維持漢字與英文字母辨識度的同時，追求極致飽滿的幾何黑白空間擠壓美感。',
    solution: '構建自定義貝茲曲線形變演算法，並開發專屬的 WebGL 字體動態海報實驗室，讓設計師能自由拖拽與生成高解析海報。',
    impact: '被知名設計雜誌 Brand New 專題報導，字型下載量突破 45,000+ 次。',
    tools: ['Glyphs 3', 'Canvas API', 'GSAP', 'Illustrator', 'React'],
    colorPalette: ['#121316', '#FBF9F4', '#FFC83B', '#E75A45'],
    metrics: [
      { label: '字型下載量', value: '45k+' },
      { label: '可變軸數', value: '4 Axes' },
      { label: '字元收錄', value: '860+ Glyphs' }
    ],
    galleryItems: [
      {
        title: 'Chunky Alphabet Matrix',
        caption: 'A-Z 全字母與數字幾何骨架展示',
        color: '#121316',
        type: 'visual'
      },
      {
        title: 'NO WAY SO SO Poster',
        caption: '高對比海報排版實驗與動態扭曲效果',
        color: '#23262D',
        type: '3d'
      }
    ]
  },
  {
    id: 'terra-cutouts',
    title: 'TERRA Papercraft & Form',
    subtitle: 'Organic Geometric Identity & Tactile Spatial Branding',
    category: 'Brand & Identity',
    tag: 'Brand / Spatial Art',
    year: '2025',
    role: 'Art Director & Brand Identity Designer',
    client: 'Terra Architecture Studio',
    featured: true,
    thumbnail: {
      type: 'geometric',
      bgColor: '#588177',
      accentColor: '#E75A45',
      badge: 'Brand Identity',
    },
    summary: '結合紙雕質感、大地陶土色系與當代幾何極簡主義的建築品牌識別系統。',
    description: '為專注於永續綠建築的 TERRA 工作室打造全套視覺語言。以手工紙張紋理、陶土紅、鼠尾草綠、米白與深炭灰構建出如同現代藝術裝置般的幾何拼貼畫卷。',
    challenge: '跳脫傳統建築師冷冽生硬的黑白線稿形象，注入自然溫潤的工藝手作靈魂。',
    solution: '研發紙張纖維噪點著色器 (Noise Shader) 與幾何模組化排版系統，應用於實體名片壓印、施工圍籬與沉浸式官方網站。',
    impact: '入選 Tokyo TDC 2025 年鑑，助客戶品牌知名度與高階客群諮詢量提升 180%。',
    tools: ['Figma', 'Photoshop', 'InDesign', 'Cinema 4D', 'WebGL'],
    colorPalette: ['#588177', '#E75A45', '#FBF9F4', '#1E293B', '#FFC83B'],
    metrics: [
      { label: '客群諮詢成長', value: '+180%' },
      { label: '國際年鑑', value: 'Tokyo TDC' },
      { label: '品牌資產模組', value: '60+ Items' }
    ],
    galleryItems: [
      {
        title: 'Tactile Stationery System',
        caption: '手工厚磅棉紙雙面凹凸壓印與特種絲印名片',
        color: '#588177',
        type: 'visual'
      },
      {
        title: 'Geometric Layout Rules',
        caption: '以黃金分割幾何方塊為基底的模組化視覺系統',
        color: '#E75A45',
        type: 'stats'
      }
    ]
  },
  {
    id: 'noodle-avatar',
    title: 'NEO BUDDY 3D Character',
    subtitle: 'Playful Claymorphism Mascot & Companion App',
    category: '3D & Motion',
    tag: '3D Mascot / App UI',
    year: '2026',
    role: 'Character Artist & 3D Generalist',
    client: 'Pocket Buddy Games',
    featured: true,
    thumbnail: {
      type: 'character',
      bgColor: '#FFC83B',
      accentColor: '#588177',
      badge: '3D Character',
    },
    summary: '溫暖俏皮的 3D 黏土風格吉祥物與情緒陪伴應用介面設計。',
    description: '以活力四射的綠眼鏡小男孩為主角，營造如同皮克斯定格動畫般的親切黏土觸感。具備眼神追隨游標、即時表情物理彈性反饋與日常互動動畫。',
    challenge: '在網頁與行動裝置上以極低耗能保持 3D 骨骼動畫流暢運行。',
    solution: '採用高模烘焙頂點色彩 + 輕量 GLTF 壓縮管線，配合 CSS Transform 視差演算法達成擬真 3D 效果。',
    impact: '應用上線首月突破 10 萬活躍用戶，次日留存率高達 64.2%。',
    tools: ['ZBrush', 'Blender', 'Substance Painter', 'Three.js', 'SwiftUI'],
    colorPalette: ['#FFC83B', '#588177', '#FBF9F4', '#4A3E3D', '#FF6B57'],
    metrics: [
      { label: '首月活躍用戶', value: '100,000+' },
      { label: '次日留存率', value: '64.2%' },
      { label: '3D模型體積', value: '< 1.4 MB' }
    ],
    galleryItems: [
      {
        title: 'Clay Shader & Rigging',
        caption: '手作黏土微瑕疵法線與面部柔體骨骼綁定',
        color: '#FFC83B',
        type: '3d'
      },
      {
        title: 'Emotional Reaction States',
        caption: '驚喜、思考、揮手打招呼等多組表情轉換切換',
        color: '#588177',
        type: 'visual'
      }
    ]
  },
  {
    id: 'omni-dash',
    title: 'OMNI Tactile Cockpit',
    subtitle: 'Next-Gen EV In-Cabin OS with Physical-Digital Cohesion',
    category: 'UI/UX & Product',
    tag: 'UI/UX / Automotive',
    year: '2025',
    role: 'Senior Product Designer',
    client: 'Omni Mobility Lab',
    featured: false,
    thumbnail: {
      type: 'dashboard',
      bgColor: '#202228',
      accentColor: '#8B72DE',
      badge: 'Product OS',
    },
    summary: '以物理觸覺卡片為靈感的新世代電動車智慧座艙操作系統。',
    description: '融合實體微動按鈕與數位 OLED 觸控面板的車載介面。駕駛者可藉由眼角餘光與大尺寸觸覺卡片直覺操作導航、音訊與空調，大幅降低行車分心風險。',
    challenge: '在多光源與高速行駛環境下，確保資訊閱讀的極限清晰度與高反差視覺。',
    solution: '設計了自適應高對比度 Bento Widget 佈局與手勢微震反饋機制。',
    impact: '獲選 2025 CES Innovation Award 車載設計特別提名。',
    tools: ['Figma', 'Protopie', 'Unreal Engine 5', 'Design Tokens'],
    colorPalette: ['#131418', '#8B72DE', '#FFC83B', '#588177', '#FFFFFF'],
    metrics: [
      { label: '操作分心秒數', value: '-42%' },
      { label: '任務完成率', value: '99.4%' },
      { label: 'CES Award', value: 'Honoree' }
    ],
    galleryItems: [
      {
        title: 'Bento Navigation Cluster',
        caption: '模組化導航卡片與能量流向即時視覺化',
        color: '#202228',
        type: 'visual'
      }
    ]
  },
  {
    id: 'archive-88',
    title: 'ARCHIVE 88 Spatial Web',
    subtitle: 'Interactive Digital Archive for Avant-Garde Design',
    category: 'UI/UX & Product',
    tag: 'Creative Coding / Web',
    year: '2025',
    role: 'Creative Developer & Art Director',
    client: 'Design Heritage Foundation',
    featured: false,
    thumbnail: {
      type: 'spatial',
      bgColor: '#1E293B',
      accentColor: '#E75A45',
      badge: 'Interactive Web',
    },
    summary: '先鋒設計史料的三維空間典藏庫，具備物理重力碰撞與沉浸式音景。',
    description: '將半個世紀以來的經典海報、字體設計與工業產品轉換為可自由拖拽、翻轉與聆聽的數位展品。',
    challenge: '在行動端瀏覽器中實現 60FPS 的大量三維物件物理模擬與空間音效定位。',
    solution: '結合 Rapier 物理引擎與 WebGL Instanced Mesh 批次渲染技術。',
    impact: '榮獲 Awwwards Site of the Day 及 FWA of the Day 雙重肯定。',
    tools: ['React Three Fiber', 'Rapier Physics', 'GLSL Shaders', 'Tailwind CSS'],
    colorPalette: ['#1E293B', '#E75A45', '#FFC83B', '#FBF9F4'],
    metrics: [
      { label: 'Awwwards', value: 'Site of the Day' },
      { label: '幀率表現', value: 'Solid 60 FPS' },
      { label: '平均停留時長', value: '4m 38s' }
    ],
    galleryItems: [
      {
        title: 'Physics Sandbox Exhibition',
        caption: '支援多點觸控的重力沙盒展品互動區域',
        color: '#1E293B',
        type: 'visual'
      }
    ]
  }
];

export const skillsData = [
  {
    category: '3D & Motion Design',
    color: '#FFC83B',
    tools: [
      { name: 'Blender 3D', level: 95, icon: 'Box', desc: '幾何建模 / 著色器 / 骨骼綁定 / 擬真物理渲染' },
      { name: 'Spline 3D', level: 90, icon: 'Boxes', desc: '網頁 3D 互動模型 / 物理事件 / 遊戲化微互動' },
      { name: 'Cinema 4D', level: 85, icon: 'Layers', desc: '動態圖形 (MoGraph) / Octane / Redshift 算圖' },
      { name: 'After Effects', level: 92, icon: 'Film', desc: '動態字體 / Lottie 動畫 / 視覺特效合成' }
    ]
  },
  {
    category: 'UI/UX & Product Design',
    color: '#8B72DE',
    tools: [
      { name: 'Figma', level: 98, icon: 'Figma', desc: 'Design Systems / Auto Layout / 擬真高保真原型' },
      { name: 'Protopie', level: 90, icon: 'Smartphone', desc: '感測器整合 / 複雜微互動邏輯 / 汽車座艙介面' },
      { name: 'Design Tokens', level: 92, icon: 'Code2', desc: '跨平台樣式同步 / 暗黑模式架構 / Bento 佈局系統' }
    ]
  },
  {
    category: 'Creative Coding & Tech',
    color: '#588177',
    tools: [
      { name: 'React / TypeScript', level: 88, icon: 'Terminal', desc: '現代前端架構 / Tailwind CSS / Framer Motion' },
      { name: 'Three.js / WebGL', level: 82, icon: 'Sparkles', desc: '3D 網頁渲染 / 自定義著色器 (GLSL) / 粒子系統' },
      { name: 'Web Audio API', level: 85, icon: 'Sliders', desc: '微擬物聲音合成 / 即時波形視覺化 / 互動音效' }
    ]
  }
];

export const experienceTimeline = [
  {
    period: '2024 — Present',
    role: 'Lead Visual & 3D Product Designer',
    company: 'HyperForm Creative Studio',
    description: '主導 3D 互動品牌識別、Bento 設計系統建構與先鋒數位產品體驗設計。'
  },
  {
    period: '2022 — 2024',
    role: 'Senior UI/UX & Motion Designer',
    company: 'Kinetic Labs Inc.',
    description: '負責新一代創意工具、動態字體實驗室與車載智慧座艙產品概念設計。'
  },
  {
    period: '2020 — 2022',
    role: 'Visual & Interactive Designer',
    company: 'Studio Monochrome',
    description: '專注於品牌識別、展覽視覺拼貼、網頁動態特效與 3D 角色建模。'
  }
];
