// src/routes/AdminRoutes.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';

import Dashboard from '../pages/Administrador/Dashboard'
const AdminRoutes: React.FC = () => (
    <ProtectedRoute requiredRoles={["Administrador"]}>
        <Routes>
            <Route index element={<Navigate to="dashboard" replace />} />
           <Route path="dashboard" element={<Dashboard />} />
           
            {/* Roles
            <Route path="roles" element={<RolesList />} />
            <Route path="roles/new" element={<RolesForm />} />
            <Route path="roles/:id/edit" element={<RolesForm />} />
 */}

            <Route path="*" element={<Navigate to="/not-found" replace />} />
        </Routes>
    </ProtectedRoute>
);

export default AdminRoutes;