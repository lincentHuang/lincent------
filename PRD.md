# 📄 產品需求規格書 (PRD.md) — Sevora 風格作品集與多語系 AI CMS 系統

> **版本**：v2.0.0  
> **負責人**：`@PM` (專案經理)  
> **目標**：全面重塑前台為 Sevora (sevora.framer.website) 頂級暗黑極簡 Bento 風格，建構中英雙語 (i18n) 系統與 AI 自動翻譯補齊模組，並提供高自由度的 Sevora 風格管理後台 (CMS)。

---

## 🎯 1. 核心需求與使用者故事 (User Stories)

1. **Sevora 視覺與佈局體驗 (Sevora Design & Flow)**：
   - 作為訪客，我進入網站時能感受到如 Sevora 般極致克制、乾淨大氣的暗黑設計、高質感微標籤、流暢滾動與卡片動態。
   - 包含：Header 浮動導航（含語系切換）、權威 Hero、Sevora 模組化 Bento 積木區（技能/工具/服務/數據）、精選專案作品輪播、架構深度剖析、經歷時程、聯絡表單、精緻 Footer。

2. **全站中英雙語 (i18n) ✕ AI 智慧翻譯補齊 (AI Auto-Translate)**：
   - 預設語系為繁體中文 (`zh-TW`)，可一鍵切換英文 (`en`)。
   - 全站靜態文案（導航、按鈕、欄位）與動態資料（Hero、專案、自訂卡片）皆具備雙語。
   - 在管理後台，當使用者只填寫中文時，點擊 **「✨ AI 補齊英文翻譯」**，AI 自動生成地道流暢的英文文案；反之亦然。

3. **Sevora 風格超級管理後台 (Comprehensive Admin CMS)**：
   - 介面升級為 Sevora 極黑精緻風格，密碼防護鎖 (`qwe123qwe`)。
   - **分頁 1：全站文案與 Hero 管理 (Site Copy CMS)**：可編輯標題、副標題、自我介紹、狀態標籤（中英雙欄 + AI 翻譯）。
   - **分頁 2：模組化 Bento 卡片管理 (Modular Cards CMS)**：自由新增/編輯/刪除技能卡、工具模組、服務項目、數據指標卡。
   - **分頁 3：專案作品管理 (Projects CMS)**：上傳封面圖 (自動轉 WebP)、編輯中英雙語標題/摘要/Markdown 內文、AI 自動提煉亮點。
   - **分頁 4：合作邀請收件匣 (Inquiries Inbox)**：即時閱讀、標記已讀/回覆/封存。

---

## 📋 2. 驗收標準 (Acceptance Criteria - AC)

* **AC-1 (語系切換)**：
  - 點擊 Header 或 Footer 的語系切換按鈕，全站即時響應切換為 `zh` 或 `en`，所有標題、按鈕、卡片內容與專案詳情頁皆同步翻譯。
* **AC-2 (AI 翻譯輔助)**：
  - 後台提供 AI 翻譯 API (`/api/ai-translate`)，支援單欄與多欄批量翻譯（中翻英、英翻中），響應時間 < 2s。
* **AC-3 (Bento 模組卡片)**：
  - 後台新增/修改/刪除的模組卡片，即時持久化至 Supabase PostgreSQL 資料庫 (`modular_cards` 表)，前台 Bento 區塊自適應排版。
* **AC-4 (五態完備)**：
  - 所有動態組件均強制實作 5 種狀態：Loading（骨架屏/載入旋轉）、Empty（空資料提示）、Error（容錯與重試）、Success（渲染完成）、Active（選取/懸停狀態）。
* **AC-5 (效能與相容)**：
  - 圖片自動壓縮為 WebP，Next.js App Router 100% 通過 TypeScript 與 Build 檢查。

---

## 🔄 3. 團隊交接指示 (Team Handoff)
- **`@Architect`**：請立即建立 `src/types/index.ts` 與升級 `prisma/schema.prisma`（支援多語系、全站設定與自訂模組卡片表）。
