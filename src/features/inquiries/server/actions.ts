'use server';

import 'server-only';
import { InquiryFormSchema, InquiryFormValues } from '../schemas/inquiry';
import { mutate } from '../../../server/content-repo';

export interface ActionResult {
  success: boolean;
  error?: string | Record<string, string[] | undefined>;
}

export async function submitInquiryAction(values: InquiryFormValues): Promise<ActionResult> {
  const parsed = InquiryFormSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: parsed.error.flatten().fieldErrors };
  }

  try {
    await mutate((doc) => {
      doc.inquiries.unshift({
        id: `inq-${Date.now()}`,
        ...parsed.data,
        company: parsed.data.company || '',
        budget: parsed.data.budget || '',
        status: 'unread',
        createdAt: new Date().toISOString(),
      });
    });
    // 只回傳成功與否，不能把其他人的詢問資料回傳給訪客
    return { success: true };
  } catch (err: any) {
    console.error('[inquiry] save failed', err);
    return { success: false, error: 'Failed to submit inquiry' };
  }
}
