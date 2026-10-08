import { z } from 'zod';

export const InquiryFormSchema = z.object({
  name: z.string().max(100).min(1, '請輸入姓名 (Name is required)'),
  company: z.string().max(200).optional(),
  email: z.string().max(200).email('請輸入有效電子郵件 (Valid email is required)'),
  scope: z.string().min(1, '請選擇合作性質 (Scope is required)'),
  budget: z.string().optional(),
  message: z.string().max(5000).min(1, '請輸入訊息內容 (Message is required)'),
});

export type InquiryFormValues = z.input<typeof InquiryFormSchema>;
