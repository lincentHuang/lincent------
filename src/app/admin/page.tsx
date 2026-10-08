import type { Metadata } from 'next';
import { AdminShell } from '../../features/admin/admin-shell';

export const metadata: Metadata = {
  title: '網站後台 | Lincent',
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminShell />;
}
