# Progress

- 2026-10-08：重構為單一 CMS 內容模型，前台所有區塊改讀後台資料（`src/content/types.ts`、`src/content/default-site.ts`、`src/server/content-repo.ts`）
- 2026-10-08：儲存層改為本機 / Cloudflare R2 自動切換，移除 Prisma 執行期依賴（`src/server/storage.ts`）
- 2026-10-08：重做圖片流程：自動轉正、WebP 壓縮、縮圖、模糊預覽、媒體庫、使用中防誤刪（`src/server/media.ts`、`src/features/admin/shared/media.tsx`、`src/components/media/media-image.tsx`）
- 2026-10-08：後台改為伺服器端驗證並保護所有寫入 API；修正詢問資料外洩到前台（`src/lib/session.ts`、`src/middleware.ts`、`src/features/inquiries/server/actions.ts`）
- 2026-10-08：後台重寫為模組化分頁，導覽對應前台結構（`src/features/admin/admin-shell.tsx`、`src/features/admin/sections/*`）
- 2026-10-08：新增「關於我」頁面，內容依履歷 PDF（`src/app/about/page.tsx`、`src/features/about/components/*`）
