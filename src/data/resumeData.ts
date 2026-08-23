export interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  duration: string;
  location: string;
  companySize?: string;
  badge?: string;
  summary: string;
  keyResponsibilities: string[];
  techTags: string[];
}

export interface SkillCategory {
  category: string;
  iconName: string;
  color: string;
  skills: {
    name: string;
    level: number;
    description: string;
    highlights?: string;
  }[];
}

export const resumeData = {
  name: "黃令成",
  englishName: "Lincent Huang",
  title: "資深前端工程師 (Senior Frontend Engineer)",
  subtitle: "兼具設計底蘊與商業思維的前端架構工程師",
  yearsOfExp: "5~6 年",
  avatar: "/lincent-avatar.png",
  contact: {
    email: "s890142s2009@gmail.com",
    phone: "0989-859-090",
    location: "新北市淡水區 (可於雙北上班 / 支持遠端工作)",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    availableDate: "2026/10/12",
    expectedSalary: "月薪 80,000 元以上",
    status: "積極求職中 (待業中)"
  },
  motto: "「最喜歡把所有複雜的東西簡單系統化，並且賦予美感跟實用性。達到極簡、創新、圓融、溫暖是我的風格；追求系統、資料、數據、整齊是我的堅持。」",
  bioStory: [
    "你好，我是黃令成 (Lincent)。我擁有超過 5 年以上的數位產品開發與設計經驗，一路從 UI/UX 設計、品牌經營，跨足深耕前端工程架構。",
    "跨領域的背景讓我擁有獨特的優勢：在面對複雜的業務需求時，我不僅能寫出高效能、高可維護的程式碼，更能從「使用者體驗」與「商業轉換率」的高度來設計系統架構，為團隊交付具備實質商業價值的產品。",
    "在海宇顧問擔任前端工程師期間，我主導了跨主題遊戲平台架構，運用 Turborepo Monorepo、Jotai 原子化狀態管理、ts-morph AST 自動化程式碼生成與 Radix UI 企業級 Design System，成功突破大型專案的編譯與渲染效能瓶頸，並賦能非技術團隊 100% 獨立上稿。"
  ],
  coreCompetencies: [
    { title: "前端架構與效能優化", desc: "Monorepo (Turborepo), Jotai 原子化狀態, Optics-TS 光學變換, Next.js, React Native" },
    { title: "企業級 Design System", desc: "基於 Radix UI 與 Storybook 打造無障礙 (a11y) 元件庫，建立團隊單一真理源" },
    { title: "DX 開發者體驗與 AI 工程化", desc: "AST 代碼自動生成 (ts-morph)、GitHub Copilot 深度整合、CI/CD 自動化流程" },
    { title: "UI/UX 與全方位視覺設計", desc: "Figma 高保真原型、Lottie/Gsap 動畫調校、品牌視覺與 SEO 流量增長策略" }
  ],
  experiences: [
    {
      company: "新加坡商海宇顧問服務有限公司台灣分公司",
      role: "前端工程師 (Frontend Engineer)",
      period: "2023/10 — 2026/8",
      duration: "2 年 11 個月",
      location: "台北市信義區",
      companySize: "30~100 人",
      badge: "核心架構主導",
      summary: "主導跨裝置遊戲平台與大型 Monorepo 架構設計，突破渲染效能與編譯瓶頸，建立企業級 Design System 與自動化代碼生成體系。",
      keyResponsibilities: [
        "【架構層級】：導入 Turborepo + Yarn Workspaces 將 4 個 App 與 9 個核心包整合為 Monorepo，大幅縮短 CI/CD 編譯時間；抽離 80+ 個 UI 區塊為獨立 npm package，最大化跨端程式碼重用率。",
        "【狀態與效能優化】：捨棄傳統全域狀態，改用 Jotai 進行細粒度反應性原子狀態管理，有效解決大量 DOM 節點變更時的渲染卡頓；實作 Optics-TS 光學變換，確保拖拽編輯器操作極致流暢。",
        "【Design System】：基於 Radix UI 與 Storybook 建立高可訪問性企業級元件庫 (@spaceman/*)，消除 UI 實作誤差。",
        "【DX & AI 工程化】：運用 ts-morph 建置 AST 自動化代碼生成工具 (cms-codegen)，從 CMS 配置自動生成 TypeScript 型別與前端串接程式碼；導入 GitHub Copilot Configurations 加速重構效率。",
        "【商業賦能】：獨立開發自訂 WYSIWYG CMS 內容平台，賦能行銷企劃團隊獨立上稿，使新功能迭代週期顯著降低。"
      ],
      techTags: ["React", "Next.js", "React Native", "Expo", "Jotai", "Turborepo", "Optics-TS", "ts-morph", "Radix UI", "Storybook", "Tailwind CSS"]
    },
    {
      company: "重量科技股份有限公司 (kryptoGO)",
      role: "網頁設計師 / 前端工程師",
      period: "2022/6 — 2023/7",
      duration: "1 年 2 個月",
      location: "台北市信義區",
      companySize: "1~30 人",
      badge: "Web3 官網與活動",
      summary: "隸屬行銷與前端核心團隊，負責官方網站、多國語系系統與活動頁面設計開發，電腦版 SEO 跑分近乎滿分。",
      keyResponsibilities: [
        "主導 kryptoGO 官方網站改版，整合 Next.js 13、Strapi CMS、i18n 多國語系與 Gsap 動畫，達成電腦版 SEO 近滿分成績。",
        "企劃並開發「心理測驗 NFT 活動網站」與「KryptoGO x 91APP 活動頁面」，透過趣味心理測驗引導用戶領取專屬 NFT，帶動 Web3 業務社群裂變轉發。",
        "負責公司企業用簡報、活動主視覺 DM、UI/UX Figma 設計與 Lottie 動畫模組。"
      ],
      techTags: ["Next.js 13", "React 18", "Strapi", "Tailwind CSS", "Styled-components", "Gsap", "Lottie", "Figma", "SEO"]
    },
    {
      company: "心也國際有限公司",
      role: "UI/UX 設計師",
      period: "2022/2 — 2022/5",
      duration: "4 個月",
      location: "台北市松山區",
      summary: "負責三個網站專案的 UI/UX 設計、改版、優化與維護，並協助行銷企劃與 SEO 流量優化。",
      keyResponsibilities: [
        "使用 Figma / XD 進行使用者介面設計與高保真 Prototype 製作。",
        "前端 HTML/CSS/JS 切版支援與 CRM 後台 (Shopify, Shopline, Wix) 營運維護。"
      ],
      techTags: ["Figma", "Adobe XD", "HTML5", "CSS3", "JavaScript", "Shopify", "SEO"]
    },
    {
      company: "阿哈哈市集實業",
      role: "網站設計師、行銷企劃",
      period: "2019/9 — 2021/11",
      duration: "2 年 3 個月",
      location: "新北市八里區",
      summary: "協助超過 10 家中小企業進行網路數位轉型與網站開發，提供全方位 UI/UX 與品牌諮詢。",
      keyResponsibilities: [
        "企業官網規劃建置、UI/UX 設計、前端切版與 Webcenter 後台維護。",
        "年度檔期活動企劃、社群經營、SEO 優化與異業結盟談判。"
      ],
      techTags: ["UI/UX", "HTML/CSS", "JavaScript", "Adobe XD", "整合行銷", "SEO"]
    },
    {
      company: "惟峰工業股份有限公司",
      role: "工程師 / 網站設計師",
      period: "2019/2 — 2022/11",
      duration: "3 年 10 個月",
      location: "新北市五股區",
      summary: "主導公司 5S 流程優化與企業官網翻轉，成功攻佔 Google 搜尋第一頁，業務開拓至海外市場。",
      keyResponsibilities: [
        "創立並維護公司 5S SOP 流程優化，協助廠務高效率運轉。",
        "獨立建置企業現代化官網，落實關鍵字優化，讓精密板金關鍵字躍居 Google 搜尋第一頁。"
      ],
      techTags: ["HTML5", "CSS3", "JavaScript", "AutoCAD", "流程優化", "Google SEO"]
    },
    {
      company: "綠蓋子蔬果昔",
      role: "小老闆 / 創辦人",
      period: "2018/3 — 2019/6",
      duration: "1 年 4 個月",
      location: "台北市北投區",
      summary: "青年創業經歷。從 0 到 1 打造蔬果昔品牌形象 LOGO、產品配方、定價與 FB 月訂閱制商業模式。",
      keyResponsibilities: [
        "設計讓人耳目一新的品牌 LOGO 與包裝形象，產品深受好評。",
        "建構社群月訂閱制模式，產生穩定現金流與忠誠客戶回購。"
      ],
      techTags: ["品牌設計", "創業管理", "社群營運", "商業模式設計"]
    }
  ],
  education: [
    {
      school: "私立南台科技大學",
      department: "創新產品設計系",
      degree: "大學畢業",
      period: "2012/9 — 2016/6",
      highlights: "專長 UX/UI 與產品設計企劃；畢業專題針對環保議題落地於新店老人公寓，成為系上必修範例專案。"
    },
    {
      school: "私立復興商工",
      department: "美工科",
      degree: "高職畢業",
      period: "2009/9 — 2012/6",
      highlights: "扎實深厚的純美術、平面排版、色彩學與視覺構成訓練。"
    }
  ]
};
