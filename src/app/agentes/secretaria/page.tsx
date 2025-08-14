'use client';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardPageLayout from '@/components/dashboard/DashboardPageLayout';

export default function SecretariaAgentPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <DashboardPageLayout title="Agente Secretaria" subtitle="">
          <></>
        </DashboardPageLayout>
      </DashboardLayout>
    </ProtectedRoute>
  );
}


