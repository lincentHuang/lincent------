'use client';

import type { MediaItem, Project, SiteContent } from '../../../content/types';
import type { InquiryItem } from '../../../types';

export interface MediaUsage {
  where: string;
  label: string;
}
export type MediaWithUsage = MediaItem & { usages: MediaUsage[] };

export class ApiError extends Error {
  constructor(message: string, public status: number, public data: any) {
    super(message);
  }
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: init?.body && !(init.body instanceof FormData) ? { 'Content-Type': 'application/json' } : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.success === false) {
    if (res.status === 401 && typeof window !== 'undefined') {
      window.dispatchEvent(new Event('admin:unauthorized'));
    }
    throw new ApiError(data.message || `請求失敗（${res.status}）`, res.status, data);
  }
  return data as T;
}

/** 後台所有 API 呼叫集中在這裡 */
export const adminApi = {
  auth: {
    status: () => request<{ authenticated: boolean; passwordConfigured: boolean }>('/api/auth'),
    login: (password: string) => request('/api/auth', { method: 'POST', body: JSON.stringify({ password }) }),
    logout: () => request('/api/auth', { method: 'DELETE' }),
  },
  site: {
    get: () => request<{ site: SiteContent; updatedAt: string }>('/api/admin/site'),
    save: (site: SiteContent) =>
      request<{ site: SiteContent }>('/api/admin/site', { method: 'PUT', body: JSON.stringify(site) }),
  },
  projects: {
    list: () => request<{ projects: Project[] }>('/api/admin/projects'),
    save: (project: Project) =>
      request<{ projects: Project[] }>('/api/admin/projects', { method: 'POST', body: JSON.stringify(project) }),
    remove: (id: string) => request(`/api/admin/projects/${encodeURIComponent(id)}`, { method: 'DELETE' }),
    reorder: (ids: string[]) =>
      request<{ projects: Project[] }>('/api/admin/projects/reorder', { method: 'POST', body: JSON.stringify({ ids }) }),
  },
  media: {
    list: () => request<{ media: MediaWithUsage[] }>('/api/admin/media'),
    updateAlt: (id: string, alt: string) =>
      request(`/api/admin/media/${id}`, { method: 'PATCH', body: JSON.stringify({ alt }) }),
    /** 被使用中會丟出 status 409，data.usages 列出使用位置 */
    remove: (id: string, force = false) => request(`/api/admin/media/${id}${force ? '?force=1' : ''}`, { method: 'DELETE' }),
  },
  inquiries: {
    list: () => request<{ inquiries: InquiryItem[] }>('/api/admin/inquiries'),
    setStatus: (id: string, status: InquiryItem['status']) =>
      request<{ inquiries: InquiryItem[] }>('/api/admin/inquiries', { method: 'PATCH', body: JSON.stringify({ id, status }) }),
    remove: (id: string) =>
      request<{ inquiries: InquiryItem[] }>(`/api/admin/inquiries?id=${encodeURIComponent(id)}`, { method: 'DELETE' }),
  },
};

/** 單檔上傳（XHR 才拿得到上傳進度） */
export function uploadFile(file: File, onProgress?: (pct: number) => void): Promise<MediaWithUsage> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/admin/media');
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress?.(Math.round((e.loaded / e.total) * 100));
    xhr.onload = () => {
      let data: any = {};
      try {
        data = JSON.parse(xhr.responseText);
      } catch {}
      if (xhr.status >= 200 && xhr.status < 300 && data.success) resolve(data.media);
      else {
        if (xhr.status === 401) window.dispatchEvent(new Event('admin:unauthorized'));
        reject(new ApiError(data.message || `上傳失敗（${xhr.status}）`, xhr.status, data));
      }
    };
    xhr.onerror = () => reject(new ApiError('網路錯誤，上傳失敗', 0, null));
    const form = new FormData();
    form.append('file', file);
    xhr.send(form);
  });
}
