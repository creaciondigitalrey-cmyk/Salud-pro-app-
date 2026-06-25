"use client";
import { useState, useEffect } from "react";
import { useProfessionalData } from "@/lib/use-professional-data";
import { getProfession } from "@/lib/professions";
import { useToast } from "@/components/saludpro/toast";
import { Loader2, Download, Copy, Check, QrCode, Share2, ExternalLink, MessageCircle, Sparkles } from "lucide-react";

export default function QrPage() {
  const { professional, loading } = useProfessionalData();
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") setOrigin(window.location.origin);
  }, []);

  if (loading) return <Loader />;
  if (!professional) return <NoProfile />;

  const config = getProfession(professional.profesion);
  const accent = professional.colorAccent || config.accent;
  const portfolioUrl = `${origin}/c/${professional.slug}`;
  const qrApiUrl = `/api/qr?slug=${professional.slug}&size=600`;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(portfolioUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    showToast("URL copiada al portapapeles", "success");
  };

  const handleDownloadQr = () => {
    const link = document.createElement("a");
    link.href = qrApiUrl;
    link.download = `QR-${professional.slug}-${professional.nombre.replace(/\s+/g, "-")}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("QR descargado", "success");
  };

  const handleShareWhatsApp = () => {
    const msg = `¡Hola! Te comparto mi portafolio profesional de salud 🩺\n\n${professional.nombre}\n${config.label}\n\nVisita mi portafolio:\n${portfolioUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Portafolio de ${professional.nombre}`,
          text: `Mira mi portafolio profesional de salud`,
          url: portfolioUrl,
        });
      } catch {}
    } else {
      handleCopyUrl();
    }
  };

  return (
    <div className="max-w-4xl mx-auto overflow-x-hidden">
      <div className="flex items-center gap-3 mb-2">
        <a href="/admin" className="text-sp-text2 hover:text-white">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
        </a>
        <h1 className="font-display text-3xl font-bold text-white">Mi QR</h1>
      </div>
      <p className="text-sp-text2 text-sm mb-6">Comparte tu portafolio profesional con un solo escaneo</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* TARJETA QR - Lado izquierdo */}
        <div className="glass rounded-3xl p-8 text-center">
          {/* QR con branding SaludPro */}
          <div className="relative inline-block mb-6">
            <div className="p-4 rounded-3xl" style={{ background: "white", boxShadow: `0 20px 60px ${accent}30` }}>
              <img
                src={qrApiUrl}
                alt={`QR de ${professional.nombre}`}
                className="w-64 h-64 mx-auto"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                  (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden");
                }}
              />
              <div className="hidden text-sp-text2">
                <Loader2 size={32} className="animate-spin mx-auto mb-2" />
                <p className="text-xs">Generando QR...</p>
              </div>

              {/* Logo SaludPro centrado sobre el QR */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "white", border: `3px solid ${accent}` }}>
                <span className="font-display font-bold text-sm" style={{ color: accent }}>S+</span>
              </div>
            </div>
          </div>

          {/* Nombre del profesional */}
          <h2 className="font-display text-xl font-bold text-white mb-1">{professional.nombre}</h2>
          <p className="text-sm text-sp-text2 mb-1">{config.emoji} {config.label}</p>
          {professional.especialidad && <p className="text-xs text-sp-text2/70 mb-4">{professional.especialidad}</p>}

          {/* Slug visible */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono mb-6" style={{ background: `${accent}15`, border: `1px solid ${accent}40`, color: accent }}>
            <span>/c/{professional.slug}</span>
          </div>

          {/* Botones de descarga */}
          <div className="flex flex-col gap-2">
            <button
              onClick={handleDownloadQr}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sp-bg text-sm transition-all hover:scale-[1.02]"
              style={{ background: "linear-gradient(135deg, #D4AF37, #F4D88A)" }}
            >
              <Download size={16} /> Descargar QR (PNG)
            </button>
            <p className="text-[10px] text-sp-text2 mt-1">
              💡 Imprime este QR y compártelo en tarjetas, flyers o WhatsApp
            </p>
          </div>
        </div>

        {/* Lado derecho - URL y compartir */}
        <div className="space-y-4">
          {/* URL del portafolio */}
          <div className="glass rounded-2xl p-6">
            <h3 className="font-display text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <ExternalLink size={18} /> URL de tu portafolio
            </h3>
            <div className="flex items-center gap-2 p-3 rounded-xl mb-3" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
              <code className="flex-1 text-sm text-white font-mono truncate">{portfolioUrl}</code>
              <button
                onClick={handleCopyUrl}
                className="p-2 rounded-lg text-sp-gold hover:bg-sp-gold/10 transition-colors flex-shrink-0"
                title="Copiar URL"
              >
                {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
              </button>
            </div>
            <a
              href={portfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-sp-teal-light hover:underline"
            >
              <ExternalLink size={14} /> Abrir mi portafolio
            </a>
          </div>

          {/* Compartir */}
          <div className="glass rounded-2xl p-6">
            <h3 className="font-display text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Share2 size={18} /> Compartir
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleShareWhatsApp}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-white"
                style={{ background: "#25D366" }}
              >
                <MessageCircle size={16} /> WhatsApp
              </button>
              <button
                onClick={handleShare}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-white"
                style={{ background: "linear-gradient(135deg, #0D9488, #06B6D4)" }}
              >
                <Share2 size={16} /> Compartir
              </button>
            </div>
            <p className="text-[10px] text-sp-text2 mt-3">
              Comparte tu portafolio en redes sociales, WhatsApp, email o donde quieras.
            </p>
          </div>

          {/* Tips de uso */}
          <div className="glass rounded-2xl p-6">
            <h3 className="font-display text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Sparkles size={18} /> Ideas para usar tu QR
            </h3>
            <ul className="space-y-2 text-sm text-sp-text2">
              <li className="flex items-start gap-2">
                <Check size={14} className="text-sp-gold flex-shrink-0 mt-0.5" />
                <span>Imprímelo en tarjetas de presentación</span>
              </li>
              <li className="flex items-start gap-2">
                <Check size={14} className="text-sp-gold flex-shrink-0 mt-0.5" />
                <span>Pégalo en tu consultorio o clínica</span>
              </li>
              <li className="flex items-start gap-2">
                <Check size={14} className="text-sp-gold flex-shrink-0 mt-0.5" />
                <span>Úsalo en flyers y publicidad impresa</span>
              </li>
              <li className="flex items-start gap-2">
                <Check size={14} className="text-sp-gold flex-shrink-0 mt-0.5" />
                <span>Compártelo en estados de WhatsApp o Instagram</span>
              </li>
              <li className="flex items-start gap-2">
                <Check size={14} className="text-sp-gold flex-shrink-0 mt-0.5" />
                <span>Inclúyelo en tu firma de email</span>
              </li>
            </ul>
          </div>

          {/* Estado de verificación */}
          <div className="glass rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: professional.verificado ? "rgba(16,185,129,0.15)" : "rgba(245,158,11,0.15)" }}>
              {professional.verificado ? (
                <Check size={18} className="text-green-400" />
              ) : (
                <Loader2 size={18} className="text-amber-400" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">
                {professional.verificado ? "Profesional Verificado" : "Verificación pendiente"}
              </p>
              <p className="text-xs text-sp-text2">
                {professional.verificado ? "Tu portafolio muestra el badge de confianza" : "Carga tus credenciales para verificar tu cuenta"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Loader() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="glass rounded-2xl p-12 text-center">
        <Loader2 size={32} className="mx-auto animate-spin text-sp-gold mb-4" />
        <p className="text-sp-text2 text-sm">Cargando tu QR...</p>
      </div>
    </div>
  );
}
function NoProfile() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="glass rounded-2xl p-12 text-center">
        <p className="text-sp-text2 text-sm">No se encontró tu perfil.</p>
      </div>
    </div>
  );
}
