"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { PLANES, DEFAULT_PLATFORM_CONFIG, SUPER_ADMIN_EMAILS } from "@/lib/super-admin-config";
import { useToast } from "@/components/saludpro/toast";
import { Settings, Save, Loader2, Mail, Phone, Clock, DollarSign, Tag, Plus, Trash2, Shield, Key, RefreshCw, TrendingUp, AlertTriangle } from "lucide-react";

export default function ConfiguracionPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [config, setConfig] = useState(DEFAULT_PLATFORM_CONFIG);
  const [planes, setPlanes] = useState(PLANES);
  const [saving, setSaving] = useState(false);
  const [codigos, setCodigos] = useState<{ code: string; descuento: number; usos: number }[]>([
    { code: "BIENVENIDA10", descuento: 10, usos: 0 },
    { code: "SALUDPRO25", descuento: 25, usos: 3 },
  ]);
  const [nuevoCodigo, setNuevoCodigo] = useState({ code: "", descuento: 10 });

  // Estado de la tasa BCV
  const [bcv, setBcv] = useState<{ rate: number; date: string; source: string; fallback?: boolean; warning?: string } | null>(null);
  const [bcvLoading, setBcvLoading] = useState(true);
  const [bcvEditing, setBcvEditing] = useState(false);
  const [bcvManual, setBcvManual] = useState("");
  const [bcvSaving, setBcvSaving] = useState(false);

  const cargarBcv = async () => {
    setBcvLoading(true);
    try {
      const res = await fetch("/api/bcv?t=" + Date.now());
      const data = await res.json();
      setBcv(data);
      setBcvManual(data.rate?.toString() || "");
    } catch (e: any) {
      showToast("Error al cargar tasa BCV", "error");
    } finally {
      setBcvLoading(false);
    }
  };

  useEffect(() => { cargarBcv(); }, []);

  const handleActualizarBcv = async () => {
    showToast("Consultando BCV...", "info");
    // Forzar recarga saltando el cache
    await cargarBcv();
    if (bcv?.fallback) {
      showToast("No se pudo actualizar automáticamente. Ingrésala manualmente abajo.", "error");
    } else {
      showToast("Tasa actualizada: " + bcv?.rate + " Bs/USD", "success");
    }
  };

  const handleGuardarBcvManual = async () => {
    const rate = parseFloat(bcvManual.replace(",", "."));
    if (!rate || rate < 50 || rate > 1000) {
      showToast("Tasa inválida (debe estar entre 50 y 1000)", "error");
      return;
    }
    setBcvSaving(true);
    try {
      const res = await fetch("/api/bcv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rate, source: "BCV (manual)" }),
      });
      const data = await res.json();
      if (data.ok) {
        setBcv({ rate, date: data.date, source: "BCV (manual)" });
        setBcvEditing(false);
        showToast(`Tasa guardada: ${rate} Bs/USD`, "success");
      } else {
        showToast("Error: " + data.error, "error");
      }
    } catch (e: any) {
      showToast("Error: " + e.message, "error");
    } finally {
      setBcvSaving(false);
    }
  };


  const handleSave = async () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      showToast("Configuración guardada (demo)", "success");
    }, 800);
  };

  const addCodigo = () => {
    if (!nuevoCodigo.code) { showToast("Ingresa un código", "error"); return; }
    if (codigos.some((c) => c.code === nuevoCodigo.code)) { showToast("Ese código ya existe", "error"); return; }
    setCodigos([...codigos, { ...nuevoCodigo, usos: 0 }]);
    setNuevoCodigo({ code: "", descuento: 10 });
    showToast("Código agregado", "success");
  };

  const removeCodigo = (code: string) => {
    setCodigos(codigos.filter((c) => c.code !== code));
    showToast("Código eliminado", "info");
  };

  return (
    <div className="max-w-4xl mx-auto overflow-x-hidden">
      <div className="flex items-center gap-3 mb-6">
        <a href="/super-admin" className="text-sp-text2 hover:text-white">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
        </a>
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Configuración</h1>
          <p className="text-sp-text2 text-sm">Ajustes de la plataforma SaludPro</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* TASA BCV */}
        <div className="glass rounded-2xl p-6">
          <h2 className="font-display text-lg font-semibold text-white mb-4 flex items-center gap-2"><TrendingUp size={18} /> Tasa del Dólar (BCV)</h2>
          {bcvLoading ? (
            <div className="text-center py-4"><Loader2 size={20} className="animate-spin text-sp-gold mx-auto mb-2" /><p className="text-xs text-sp-text2">Cargando tasa...</p></div>
          ) : (
            <div>
              <div className="flex items-center justify-between p-4 rounded-xl mb-3" style={{ background: bcv?.fallback ? "rgba(245,158,11,0.1)" : "rgba(13,148,136,0.1)", border: `1px solid ${bcv?.fallback ? "rgba(245,158,11,0.3)" : "rgba(13,148,136,0.3)"}` }}>
                <div>
                  <p className="text-xs text-sp-text2 uppercase mb-1">Tasa actual</p>
                  <p className="font-display text-3xl font-bold text-white">{bcv?.rate} <span className="text-sm text-sp-text2 font-normal">Bs/USD</span></p>
                  <p className="text-xs text-sp-text2 mt-1">{bcv?.source} · {bcv?.date}</p>
                </div>
                {bcv?.fallback && (
                  <div className="text-right">
                    <AlertTriangle size={20} className="text-amber-400 mb-1" />
                    <p className="text-[10px] text-amber-400">Desactualizada</p>
                  </div>
                )}
              </div>

              {bcv?.warning && (
                <div className="p-3 rounded-lg mb-3" style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)" }}>
                  <p className="text-xs text-amber-400 flex items-start gap-2"><AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />{bcv.warning}</p>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleActualizarBcv}
                  disabled={bcvLoading}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white"
                  style={{ background: "linear-gradient(135deg, #0D9488, #06B6D4)" }}
                >
                  <RefreshCw size={14} className={bcvLoading ? "animate-spin" : ""} /> Actualizar automático
                </button>
                <button
                  onClick={() => setBcvEditing(!bcvEditing)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-sp-gold border border-sp-gold/30 hover:bg-sp-gold/10"
                >
                  <DollarSign size={14} /> {bcvEditing ? "Cancelar" : "Ingresar manual"}
                </button>
              </div>

              {bcvEditing && (
                <div className="mt-4 p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <label className="text-xs text-sp-text2 mb-1 block">Tasa del dólar hoy (Bs/USD)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={bcvManual}
                      onChange={(e) => setBcvManual(e.target.value)}
                      placeholder="245.50"
                      className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white font-mono"
                      autoFocus
                    />
                    <button
                      onClick={handleGuardarBcvManual}
                      disabled={bcvSaving}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-sp-bg"
                      style={{ background: "linear-gradient(135deg, #D4AF37, #F4D88A)" }}
                    >
                      {bcvSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Guardar
                    </button>
                  </div>
                  <p className="text-[10px] text-sp-text2 mt-2">
                    💡 Consulta la tasa oficial en <a href="https://www.bcv.org.ve" target="_blank" rel="noopener noreferrer" className="text-sp-gold hover:underline">bcv.org.ve</a> e ingrésala aquí.
                    Se usará en todos los portafolios hasta que se actualice automáticamente.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Soporte */}
        <div className="glass rounded-2xl p-6">
          <h2 className="font-display text-lg font-semibold text-white mb-4 flex items-center gap-2"><Settings size={18} /> Soporte y Contacto</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-sp-text2 mb-1 block flex items-center gap-1"><Phone size={11} /> WhatsApp de soporte</label>
              <input value={config.whatsappSoporte} onChange={(e) => setConfig({ ...config, whatsappSoporte: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white" />
            </div>
            <div>
              <label className="text-xs text-sp-text2 mb-1 block flex items-center gap-1"><Mail size={11} /> Email de soporte</label>
              <input value={config.emailSoporte} onChange={(e) => setConfig({ ...config, emailSoporte: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white" />
            </div>
          </div>
        </div>

        {/* Planes */}
        <div className="glass rounded-2xl p-6">
          <h2 className="font-display text-lg font-semibold text-white mb-4 flex items-center gap-2"><DollarSign size={18} /> Planes y Precios</h2>
          <div className="space-y-2">
            {planes.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="w-3 h-3 rounded-full" style={{ background: p.color }} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{p.nombre}</p>
                  <p className="text-xs text-sp-text2">{p.duracion} · {p.limiteFotos === Infinity ? "Ilimitado" : `${p.limiteFotos} fotos`}</p>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sp-text2 text-sm">$</span>
                  <input
                    type="number"
                    value={p.precio}
                    onChange={(e) => setPlanes(planes.map((pl, idx) => idx === i ? { ...pl, precio: Number(e.target.value) } : pl))}
                    className="w-20 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-sm text-white text-center"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trial */}
        <div className="glass rounded-2xl p-6">
          <h2 className="font-display text-lg font-semibold text-white mb-4 flex items-center gap-2"><Clock size={18} /> Período de Prueba</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-sp-text2 mb-1 block">Duración del trial (días)</label>
              <input type="number" value={config.duracionTrialDias} onChange={(e) => setConfig({ ...config, duracionTrialDias: Number(e.target.value) })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white" />
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
              <input type="checkbox" id="regAuto" checked={config.registroAutomaticoHabilitado} onChange={(e) => setConfig({ ...config, registroAutomaticoHabilitado: e.target.checked })} className="w-4 h-4 accent-sp-gold" />
              <label htmlFor="regAuto" className="text-sm text-white cursor-pointer">Habilitar registro automático (formulario público)</label>
            </div>
          </div>
        </div>

        {/* Códigos de descuento */}
        <div className="glass rounded-2xl p-6">
          <h2 className="font-display text-lg font-semibold text-white mb-4 flex items-center gap-2"><Tag size={18} /> Códigos de Descuento</h2>
          <div className="space-y-2 mb-3">
            {codigos.length === 0 ? (
              <p className="text-sm text-sp-text2 text-center py-4">No hay códigos activos</p>
            ) : (
              codigos.map((c) => (
                <div key={c.code} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                  <code className="text-sm text-sp-gold font-mono flex-1">{c.code}</code>
                  <span className="text-sm text-white">-{c.descuento}%</span>
                  <span className="text-xs text-sp-text2">{c.usos} usos</span>
                  <button onClick={() => removeCodigo(c.code)} className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
          <div className="flex gap-2">
            <input value={nuevoCodigo.code} onChange={(e) => setNuevoCodigo({ ...nuevoCodigo, code: e.target.value.toUpperCase() })} placeholder="CÓDIGO" className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white font-mono uppercase" />
            <input type="number" min="1" max="100" value={nuevoCodigo.descuento} onChange={(e) => setNuevoCodigo({ ...nuevoCodigo, descuento: Number(e.target.value) })} className="w-20 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white text-center" />
            <button onClick={addCodigo} className="px-4 py-2 rounded-lg text-sm font-medium text-sp-bg" style={{ background: "linear-gradient(135deg, #D4AF37, #F4D88A)" }}>
              <Plus size={14} />
            </button>
          </div>
        </div>

        {/* Marca */}
        <div className="glass rounded-2xl p-6">
          <h2 className="font-display text-lg font-semibold text-white mb-4 flex items-center gap-2"><Shield size={18} /> Marca Blanca</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-sp-text2 mb-1 block">Marca del desarrollador</label>
              <input value={config.marcaDesarrollador} onChange={(e) => setConfig({ ...config, marcaDesarrollador: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white" />
            </div>
            <div>
              <label className="text-xs text-sp-text2 mb-1 block">Sub-marca</label>
              <input value={config.subMarcaDesarrollador} onChange={(e) => setConfig({ ...config, subMarcaDesarrollador: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white" />
            </div>
          </div>
        </div>

        {/* Super admins */}
        <div className="glass rounded-2xl p-6">
          <h2 className="font-display text-lg font-semibold text-white mb-4 flex items-center gap-2"><Key size={18} /> Super Admins Autorizados</h2>
          <div className="space-y-2">
            {SUPER_ADMIN_EMAILS.map((email) => (
              <div key={email} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                <Shield size={14} className="text-sp-gold" />
                <code className="text-sm text-white flex-1">{email}</code>
                {email === user?.email && <span className="text-[10px] px-2 py-0.5 rounded-full bg-sp-gold/20 text-sp-gold">TÚ</span>}
              </div>
            ))}
          </div>
          <p className="text-xs text-sp-text2 mt-3">Para agregar nuevos super admins, edita <code className="text-sp-gold">src/lib/super-admin-config.ts</code></p>
        </div>

        {/* Save */}
        <div className="flex justify-end pt-2">
          <button onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-sp-bg" style={{ background: "linear-gradient(135deg, #D4AF37, #F4D88A)" }}>
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Guardar configuración
          </button>
        </div>
      </div>
    </div>
  );
}
