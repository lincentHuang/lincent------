import type { Metadata } from 'next';
import { AdminDashboard } from '../../features/admin/components/admin-dashboard';

export const metadata: Metadata = {
  title: 'Admin Management Console | Lincent Studio',
  description: 'Manage site configuration, modular cards, projects showcase, and client inquiries.',
};

export default function AdminPage() {
  return <AdminDashboard />;
}
