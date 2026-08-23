import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { title, description, techStack, category, role } = await request.json();

    const stackList = Array.isArray(techStack) ? techStack : (techStack || '').split(',');
    const cleanStack = stackList.map((s: string) => s.trim()).filter(Boolean);

    // AI Highlight Generator Simulation
    const primaryStack = cleanStack[0] || 'Next.js';
    const secondaryStack = cleanStack[1] || 'Jotai';

    const coreHighlights = [
      `以 ${primaryStack} 構建現代化高擴展前端架構，強化模組重用與極致效能`,
      `整合 ${secondaryStack} 進行狀態與數據流解耦，確保跨元件通訊零阻塞`,
      `導入自動化型別檢查與 CI/CD 流程，降低 50% 線上異常率`,
      `落實語意化標籤與結構化 SEO 資料，顯著提升自然搜尋曝光`
    ];

    const animationHighlights = [
      `運用 Framer Motion / 物理彈性引擎調校 60FPS 流暢手勢回饋`,
      `關鍵卡片與按鈕配備懸停環境光暈與微互動音效回饋`,
      `路由切換與數據載入時具備骨架屏 (Skeleton) 與平滑漸變`
    ];

    const usageScenarios = [
      `終端使用者：在桌面與行動端均可享受極速、無延遲的沉浸式操作`,
      `營運與行銷團隊：可快速掌握成效數據，輕鬆調整介面內容與曝光版位`,
      `工程維護團隊：模組化程式碼結構清晰，新進成員可在 1 天內快速上手`
    ];

    const clientPitch = `「${title || '本專案'}」展示了從架構設計、狀態管理到動態美學的全方位整合能力。不僅追求頂級的程式碼品質與執行效能，更聚焦於為企業客戶創造實質的商業轉換與品牌價值。`;

    // Generate full structured Markdown report
    const contentMd = `## 專案核心目標與痛點解決

在當前高度競爭的數位環境中，**${title || '本專案'}** 旨在透過前瞻的前端工程技術，解決系統架構複雜、使用者體驗不順暢以及維護成本高昂的關鍵挑戰。

---

## 關鍵技術突破與架構設計

### 1. 現代化核心技術棧整合
- 採用 **${cleanStack.join('、') || 'React、Next.js、TypeScript、Tailwind CSS'}** 建立高度模組化體系。
- 嚴格落實型別安全 (Type-safety) 與單一職責原則，實現高達 **85%** 的組件重複使用率。

### 2. 狀態管理與數據流解耦
- 引入細粒度響應式狀態架構，解決深層巢狀物件頻繁更新所導致的頁面重繪痛點。
- 搭配快取策略與邊緣運算，確保用戶在各類網路環境下皆能秒級取得最新資訊。

### 3. 設計系統 (Design System) 與微互動美學
- 遵循無障礙設計 (a11y) 標準，建構統一的 Design Tokens 與色彩光暈規範。
- 精心調校 60FPS 物理彈性動效，在專業嚴謹的底層上賦予生動親切的互動體驗。

---

## 商業成效與實質價值

> 🎯 **成果驗證**：專案上線後大幅縮短了 70% 的功能迭代週期，並顯著提升終端用戶滿意度與品牌信任感。`;

    // Determine theme color
    let themeColor: 'yellow' | 'purple' | 'coral' | 'mint' = 'yellow';
    if (category?.toLowerCase().includes('web3') || title?.toLowerCase().includes('krypto')) {
      themeColor = 'purple';
    } else if (category?.toLowerCase().includes('interactive') || title?.toLowerCase().includes('nft')) {
      themeColor = 'coral';
    } else if (category?.toLowerCase().includes('brand') || category?.toLowerCase().includes('seo')) {
      themeColor = 'mint';
    }

    const badge = '✨ 亮點專案';

    return NextResponse.json({
      success: true,
      data: {
        coreHighlights,
        animationHighlights,
        usageScenarios,
        clientPitch,
        contentMd,
        themeColor,
        badge,
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'AI 生成失敗', error: error.message },
      { status: 500 }
    );
  }
}
