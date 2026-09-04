'use server';

import 'server-only';
import { InquiryFormSchema, InquiryFormValues } from '../schemas/inquiry';
import { createInquiry } from '../../../lib/db';
import { InquiryItem } from '../../../types';

export interface ActionResult<T = any> {
  success: boolean;
  data?: T;
  error?: string | Record<string, string[]>;
}

export async function submitInquiryAction(
  values: InquiryFormValues
): Promise<ActionResult<InquiryItem[]>> {
  const parsed = InquiryFormSchema.safeParse(values);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const updatedInquiries = await createInquiry({
      name: parsed.data.name,
      company: parsed.data.company,
      email: parsed.data.email,
      scope: parsed.data.scope,
      budget: parsed.data.budget,
      message: parsed.data.message,
    });

    return {
      success: true,
      data: updatedInquiries,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Failed to submit inquiry',
    };
  }
}
