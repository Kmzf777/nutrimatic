'use client';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardPageLayout from '@/components/dashboard/DashboardPageLayout';

export default function PosVendaAgentPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <DashboardPageLayout title="Agente de Pós-Venda" subtitle="">
          <></>
        </DashboardPageLayout>
      </DashboardLayout>
    </ProtectedRoute>
  );
}


