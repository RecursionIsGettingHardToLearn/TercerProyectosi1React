// src/pages/Perfil.tsx
import { useEffect, useMemo, useState } from "react";
import type { CustomUser } from "../types/index";
import { useAuth } from "../contexts/AuthContext";
import axiosInstance from "../app/axiosInstance";

/**
 * Vista de perfil del usuario autenticado.
 * Muestra: id, username y rol (id, nombre), exactamente como lo entrega /usuarios/me/.
 */
export default function Perfil() {
  const { user: userFromCtx, loading } = useAuth();
  const [me, setMe] = useState<CustomUser | null>(userFromCtx);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initials = useMemo(() => {
    const u = me?.username?.trim() ?? "?";
    return u.charAt(0).toUpperCase();
  }, [me?.username]);

  const fetchMe = async () => {
    setPending(true);
    setError(null);
    try {
      const { data } = await axiosInstance.get<CustomUser>("/usuarios/me/");
      setMe(data);
    } catch (e: any) {
      const msg = e?.response?.data?.detail || e?.message || "No se pudo cargar el perfil.";
      setError(String(msg));
    } finally {
      setPending(false);
    }
  };

  useEffect(() => {
    // Si no hay usuario en contexto, intenta traerlo del backend
    if (!userFromCtx && !me && !loading) {
      void fetchMe();
    } else if (userFromCtx && !me) {
      setMe(userFromCtx);
    }
  }, [userFromCtx, me, loading]);

  const raw = useMemo(() => (
    me ? JSON.stringify({
      id: (me as any).id,
      username: (me as any).username,
      rol: (me as any).rol ? {
        id: (me as any).rol.id,
        nombre: (me as any).rol.nombre,
      } : null,
    }, null, 2) : "{}"
  ), [me]);

  const copyJSON = async () => {
    try {
      await navigator.clipboard.writeText(raw);
    } catch {
      // no-op
    }
  };

  return (
    <div className="mx-auto max-w-3xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Perfil</h1>
        <div className="flex gap-2">
          <button
            onClick={fetchMe}
            disabled={pending}
            className="rounded-xl px-4 py-2 text-sm border shadow-sm disabled:opacity-50"
          >
            {pending ? "Actualizando..." : "Refrescar"}
          </button>
          <button
            onClick={copyJSON}
            className="rounded-xl px-4 py-2 text-sm border shadow-sm"
            title="Copiar JSON"
          >
            Copiar JSON
          </button>
        </div>
      </div>

      {/* Tarjeta principal */}
      <div className="rounded-2xl border shadow-sm p-6 bg-white/5">
        {/* Encabezado con avatar */}
        <div className="flex items-center gap-4 mb-6">
          <div className="size-12 rounded-full grid place-items-center border shadow-sm text-lg font-bold">
            {initials}
          </div>
          <div>
            <div className="text-base text-neutral-500">Usuario</div>
            <div className="text-xl font-medium">{me?.username ?? (loading || pending ? "Cargando..." : "—")}</div>
          </div>
        </div>

        {/* Estado de error */}
        {error && (
          <div className="mb-4 rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Datos en formato solicitado */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-xl border p-4 bg-white/40">
            <h2 className="font-semibold mb-3">Datos</h2>
            <dl className="space-y-3">
              <div className="flex items-center justify-between">
                <dt className="text-neutral-600">ID</dt>
                <dd className="font-medium">{me?.id ?? "—"}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-neutral-600">Username</dt>
                <dd className="font-medium break-all">{me?.username ?? "—"}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-neutral-600">Rol ID</dt>
                <dd className="font-medium">{(me as any)?.rol?.id ?? "—"}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-neutral-600">Rol</dt>
                <dd className="font-medium">{(me as any)?.rol?.nombre ?? "—"}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-xl border p-4 bg-white/40">
            <h2 className="font-semibold mb-3">JSON de la API</h2>
            <pre className="text-sm overflow-auto max-h-64 whitespace-pre-wrap break-words bg-black/5 p-3 rounded-lg">
              {raw}
            </pre>
          </div>
        </div>
      </div>

      {/* Hint si no hay sesión */}
      {!loading && !pending && !me && !error && (
        <div className="mt-4 text-sm text-neutral-600">
          No hay sesión activa. Ingresa para ver tu perfil.
        </div>
      )}
    </div>
  );
}
