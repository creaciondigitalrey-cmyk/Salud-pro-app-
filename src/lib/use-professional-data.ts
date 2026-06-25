"use client";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./auth-context";
import { getProfessionalByEmail } from "./professionals-service";
import { Professional } from "./types";
export function useProfessionalData() {
  const { user } = useAuth();
  const [professional, setProfessional] = useState<Professional | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const cargar = useCallback(async () => { if (!user?.email) return; setLoading(true); setError(""); try { const prof = await getProfessionalByEmail(user.email); setProfessional(prof); } catch (e: any) { setError(e.message); } finally { setLoading(false); } }, [user?.email]);
  useEffect(() => { cargar(); }, [cargar]);
  const guardar = useCallback(async (data: Partial<Professional>) => {
    if (!professional) return false;
    setSaving(true); setError("");
    try {
      const res = await fetch("/api/update-professional", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: professional.id, data }) });
      const result = await res.json();
      if (result.ok) { setProfessional(prev => prev ? { ...prev, ...data } : null); return true; }
      else { setError(result.error || "Error al guardar"); return false; }
    } catch (e: any) { setError(e.message); return false; } finally { setSaving(false); }
  }, [professional]);
  return { professional, loading, saving, error, cargar, guardar, setProfessional };
}
