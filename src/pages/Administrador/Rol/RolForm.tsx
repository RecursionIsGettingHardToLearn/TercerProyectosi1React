
// src/pages/Admin/Roles/RolesForm.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchRol, createRol, updateRol } from '../../../api/api';
import type { Rol } from '../../../types';

interface RolFormDto {
  nombre: string;
}

const RolesForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState<RolFormDto>({ nombre: '' });
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isEdit && id) {
      setLoading(true);
      fetchRol(+id)
        .then((r: Rol) => setForm({ nombre: r.nombre }))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setForm({ nombre: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEdit && id) {
        await updateRol(+id, form);
      } else {
        await createRol(form);
      }
      navigate('/administrador/roles');
    } catch (error) {
      console.error('Error al guardar rol', error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">
        {isEdit ? 'Editar Rol' : 'Nuevo Rol'}
      </h2>

      {loading ? (
        <p>Cargando datos…</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
          <div>
            <label className="block mb-1">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
              className="w-full border px-2 py-1 rounded"
            />
          </div>

          <div className="flex space-x-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Guardar
            </button>
            <button
              type="button"
              onClick={() => navigate('/administrador/roles')}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default RolesForm;
