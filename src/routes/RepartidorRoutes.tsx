// src/routes/AdminRoutes.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';


const AdminRoutes: React.FC = () => (
    <ProtectedRoute requiredRoles={["Repartidor"]}>
        <Routes>
            <Route index element={<Navigate to="dashboard" replace />} />
            {/* 
            <Route path="dashboard" element={<Dashboard />} />
            {/* Usuarios 
            <Route path="users" element={<UserList />} />
            <Route path="users/new" element={<UserForm />} />
            <Route path="users/:id/edit" element={<UserForm />} />
            */}
            <Route path="*" element={<Navigate to="/not-found" replace />} />
        </Routes>
    </ProtectedRoute>
);

export default AdminRoutes;