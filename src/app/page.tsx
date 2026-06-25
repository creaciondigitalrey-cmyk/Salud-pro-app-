"use client";
import { motion } from "framer-motion";
import { AmbientBackground } from "@/components/saludpro/ambient-background";
import { SaludProLogoFull, SaludProLogo } from "@/components/saludpro/logo";
import { Reveal, Eyebrow } from "@/components/saludpro/reveal";
import { PROFESSION_LIST, CATEGORIAS, getProfession } from "@/lib/professions";
import { Stethoscope, Syringe, Brain, Dumbbell, Apple, Smile, Baby, Heart, HeartHandshake, Building2, Eye, Footprints, Sparkles, Scissors, Hand, ArrowRight, Check, Star, QrCode, Calendar, MessageCircle, MapPin, CreditCard, Shield, Zap, Wand2, Bot, ImagePlus, FileText, ChevronDown } from "lucide-react";
const iconMap: Record<string, any> = { Syringe, Stethoscope, Brain, Dumbbell, Apple, Smile, Baby, Heart, HeartHandshake, Building2, Eye, Footprints, Sparkles, Scissors, Hand };
export default function LandingPage() {
  const W = "https://wa.me/584225507708?text=" + encodeURIComponent("Hola Reinaldo, vi SaludPro y quiero mi portafolio profesional.");
  return (
    <main className="relative">
      <AmbientBackground />
      <nav className="sticky top-0 z-40 backdrop-blur-xl bg-sp-bg/60 border-b border-white/5"><div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between"><SaludProLogoFull size={42} /><div className="hidden md:flex items-center gap-8 text-sm"><a href="#profesiones" className="text-sp-text2 hover:text-white">Profesiones</a><a href="#como-funciona" className="text-sp-text2 hover:text-white">Cómo funciona</a><a href="#features" className="text-sp-text2 hover:text-white">Features</a><a href="#ia" className="text-sp-gold hover:text-white flex items-center gap-1.5 font-medium">✨ IA</a><a href="#precios" className="text-sp-text2 hover:text-white">Precios</a></div><div className="flex items-center gap-2"><a href="/super-admin/login" className="flex p-2 rounded-lg text-sp-gold/60 hover:text-sp-gold"><Shield size={16} /></a><a href="/admin/login" className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium text-white border-gradient">Iniciar sesión</a></div></div></nav>
      {/* HERO - Mensaje principal */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-6 py-20">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2 }} className="flex justify-center mb-8"><div className="relative"><SaludProLogo size={120} /><div className="absolute inset-0 blur-2xl opacity-50 -z-10" style={{ background: "radial-gradient(circle, #0D9488 0%, transparent 70%)" }} /></div></motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mb-6"><span className="text-xs font-mono tracking-[0.4em] text-sp-teal-light uppercase">Salud · Bienestar · Belleza · Profesionalismo</span></motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="font-display text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight mb-6"><span className="text-white">Tu portafolio </span><span className="text-gradient-teal">profesional</span><br /><span className="text-white">en 5 minutos</span></motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }} className="text-lg sm:text-xl text-sp-text2 max-w-2xl mx-auto mb-6">Para profesionales de la <span className="text-sp-teal-light font-medium">salud</span>, la <span className="text-sp-gold font-medium">belleza</span>, el <span className="text-orange-400 font-medium">fitness</span> y el <span className="text-pink-400 font-medium">bienestar</span>.</motion.p>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }} className="text-sm text-sp-text2/70 max-w-2xl mx-auto mb-10">Médicos, enfermeras, barberos, nail artists, entrenadores, esteticistas y más. Si ofreces un servicio profesional, aquí tienes tu portafolio comercial con IA.</motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }} className="flex flex-col sm:flex-row gap-4 justify-center items-center"><a href={W} target="_blank" rel="noopener noreferrer" className="px-8 py-4 rounded-full font-medium text-white transition-all hover-lift" style={{ background: "linear-gradient(135deg, #0D9488 0%, #06B6D4 100%)", boxShadow: "0 0 40px rgba(13,148,136,0.4)" }}><span className="flex items-center gap-2">Solicitar mi portafolio<ArrowRight size={18} /></span></a><a href="/c/maria-gonzalez" className="px-8 py-4 rounded-full font-medium text-white transition-all hover-lift border-gradient"><span className="flex items-center gap-2">Ver demo<ArrowRight size={18} /></span></a></motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }} className="mt-12 flex flex-wrap justify-center gap-6 text-xs text-sp-text2"><span className="flex items-center gap-2"><Check size={14} className="text-sp-health-green" /> 15 días gratis</span><span className="flex items-center gap-2"><Check size={14} className="text-sp-health-green" /> Sin tarjeta</span><span className="flex items-center gap-2"><Check size={14} className="text-sp-health-green" /> Cancelas cuando quieras</span></motion.div>
        </div>
      </section>

      {/* BANNER DUAL - Mensaje clave */}
      <section className="relative px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="rounded-3xl p-8 md:p-10 text-center" style={{ background: "linear-gradient(135deg, rgba(13,148,136,0.12), rgba(212,175,55,0.08))", border: "1px solid rgba(13,148,136,0.3)" }}>
              <p className="font-display text-xl md:text-2xl text-white mb-3">¿Eres profesional de la <span className="text-sp-teal-light">salud</span>?</p>
              <p className="text-sp-text2 text-sm mb-6">Médicos, enfermeras, psicólogos, fisioterapeutas, odontólogos y más. Tu portafolio clínico profesional con verificación de credenciales.</p>
              <div className="h-px my-6" style={{ background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.5), transparent)" }} />
              <p className="font-display text-xl md:text-2xl text-white mb-3">¿O te dedicas al <span className="text-sp-gold">bienestar y la belleza</span>?</p>
              <p className="text-sp-text2 text-sm">Barberos, nail artists, esteticistas, entrenadores y podólogos. También tienes tu portafolio comercial con catálogo, precios y todo lo que necesitas para vender.</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* PROFESIONES - Agrupadas en 5 categorías */}
      <section id="profesiones" className="relative py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Reveal><Eyebrow color="teal">Para todos</Eyebrow></Reveal>
            <Reveal delay={0.1}><h2 className="font-display text-4xl sm:text-5xl font-bold mt-6 mb-4">17+ profesiones<br /><span className="text-gradient-teal">una sola plataforma</span></h2></Reveal>
            <Reveal delay={0.15}><p className="text-sp-text2 text-sm max-w-2xl mx-auto">Salud, belleza, barbería, fitness y cuidado de pies. Todas con plantillas pre-cargadas según tu profesión.</p></Reveal>
          </div>
          <div className="space-y-8">
            {CATEGORIAS.map((cat, ci) => {
              const profs = cat.profesiones.map(id => getProfession(id));
              return (
                <Reveal key={cat.id} delay={ci * 0.05}>
                  <div className="card-category rounded-3xl p-6 md:p-8" style={{ ["--accent" as any]: cat.accent, ["--accent-glow" as any]: `${cat.accent}30` }}>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl" style={{ background: `${cat.accent}25`, border: `1px solid ${cat.accent}60`, boxShadow: `0 0 20px ${cat.accent}40` }}>{cat.emoji}</div>
                      <div>
                        <h3 className="font-display text-xl font-bold text-white">{cat.label}</h3>
                        <p className="text-xs text-sp-text2">{cat.descripcion} · {profs.length} profesión(es)</p>
                      </div>
                      <div className="ml-auto hidden md:flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase" style={{ background: `${cat.accent}20`, color: cat.accent, border: `1px solid ${cat.accent}50` }}>
                        {cat.id === "salud" ? "🩺 Salud" : cat.id === "belleza" ? "💅 Belleza" : cat.id === "barberia" ? "💇 Estilo" : cat.id === "fitness" ? "🏋️ Fitness" : "🦶 Pies"}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                      {profs.map((p) => {
                        const Icon = iconMap[p.icon] || Stethoscope;
                        return (
                          <motion.div
                            key={p.id}
                            whileHover={{ y: -4 }}
                            className="card-with-bg group p-4 rounded-xl text-center"
                            style={{
                              ["--accent" as any]: p.accent,
                              ["--accent-glow" as any]: `${p.accent}40`,
                              ["--bg-pattern" as any]: `radial-gradient(circle at 30% 30%, ${p.accent} 0%, transparent 60%), radial-gradient(circle at 70% 70%, ${p.accentLight} 0%, transparent 50%)`
                            }}
                          >
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2 transition-transform group-hover:scale-110" style={{ background: `${p.accent}30`, border: `1px solid ${p.accent}60`, boxShadow: `0 0 16px ${p.accent}50` }}>
                              <Icon size={22} color={p.accent} strokeWidth={1.8} />
                            </div>
                            <p className="font-display text-xs font-semibold text-white">{p.label}</p>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section id="como-funciona" className="relative py-24 px-6"><div className="max-w-6xl mx-auto"><div className="text-center mb-16"><Reveal><Eyebrow color="cyan">Simple</Eyebrow></Reveal><Reveal delay={0.1}><h2 className="font-display text-4xl sm:text-5xl font-bold mt-6 mb-4">¿Cómo <span className="text-gradient-teal">funciona</span>?</h2></Reveal></div><div className="grid grid-cols-1 md:grid-cols-3 gap-8">{[{num:"01",title:"Regístrate",desc:"Elige tu profesión y nosotros pre-cargamos servicios y catálogo según tu área.",icon:Zap,color:"#0D9488"},{num:"02",title:"Personaliza",desc:"Edita tu foto, servicios, precios, horarios. Sube fotos o genera con IA.",icon:Sparkles,color:"#06B6D4"},{num:"03",title:"Comparte tu URL",desc:"Recibe tu URL y QR. ¡Listo para vender!",icon:QrCode,color:"#D4AF37"}].map((step,i)=>(<Reveal key={step.num} delay={i*0.15}><div className="card-glow relative p-8 rounded-2xl h-full" style={{["--accent" as any]:step.color,["--accent-glow" as any]:`${step.color}30`}}><div className="absolute -top-4 -left-4 w-14 h-14 rounded-2xl flex items-center justify-center font-display font-bold text-xl text-white" style={{background:`linear-gradient(135deg, ${step.color} 0%, ${step.color}cc 100%)`,boxShadow:`0 0 20px ${step.color}50`}}>{step.num}</div><div className="mt-6 mb-4"><step.icon size={32} color={step.color} strokeWidth={1.5} /></div><h3 className="font-display text-xl font-bold text-white mb-3">{step.title}</h3><p className="text-sp-text2 text-sm leading-relaxed">{step.desc}</p></div></Reveal>))}</div></div></section>

      {/* FEATURES */}
      <section id="features" className="relative py-24 px-6"><div className="max-w-7xl mx-auto"><div className="text-center mb-16"><Reveal><Eyebrow color="green">Completo</Eyebrow></Reveal><Reveal delay={0.1}><h2 className="font-display text-4xl sm:text-5xl font-bold mt-6 mb-4">Todo lo que <span className="text-gradient-teal">necesitas</span></h2></Reveal></div><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{[{icon:Stethoscope,title:"Catálogo de servicios",desc:"Lista tus servicios con precios.",color:"#0D9488",bgPattern:"radial-gradient(circle at 30% 30%, #0D9488 0%, transparent 60%)"},{icon:Calendar,title:"Agenda visual",desc:"Muestra tus horarios disponibles.",color:"#06B6D4",bgPattern:"radial-gradient(circle at 30% 30%, #06B6D4 0%, transparent 60%)"},{icon:MessageCircle,title:"WhatsApp directo",desc:"Botón flotante con mensaje pre-cargado.",color:"#10B981",bgPattern:"radial-gradient(circle at 30% 30%, #10B981 0%, transparent 60%)"},{icon:QrCode,title:"QR descargable",desc:"QR personalizado para imprimir.",color:"#D4AF37",bgPattern:"radial-gradient(circle at 30% 30%, #D4AF37 0%, transparent 60%)"},{icon:CreditCard,title:"Pagos múltiples",desc:"Pago móvil, Zelle, PayPal, efectivo.",color:"#7C3AED",bgPattern:"radial-gradient(circle at 30% 30%, #7C3AED 0%, transparent 60%)"},{icon:MapPin,title:"Ubicación y maps",desc:"Google Maps + zonas de cobertura.",color:"#EA580C",bgPattern:"radial-gradient(circle at 30% 30%, #EA580C 0%, transparent 60%)",showMap:true},{icon:Star,title:"Testimonios",desc:"Reseñas de clientes con estrellas.",color:"#F59E0B",bgPattern:"radial-gradient(circle at 30% 30%, #F59E0B 0%, transparent 60%)"},{icon:Shield,title:"Certificaciones",desc:"Títulos y licencias profesionales.",color:"#1E3A8A",bgPattern:"radial-gradient(circle at 30% 30%, #1E3A8A 0%, transparent 60%)"},{icon:Heart,title:"Multi-dispositivo",desc:"PWA instalable en móvil y desktop.",color:"#DB2777",bgPattern:"radial-gradient(circle at 30% 30%, #DB2777 0%, transparent 60%)"}].map((f,i)=>(<Reveal key={f.title} delay={i*0.06}><motion.div whileHover={{ y: -6 }} className="card-with-bg group p-6 rounded-2xl h-full" style={{["--accent" as any]:f.color,["--accent-glow" as any]:`${f.color}40`,["--bg-pattern" as any]:f.bgPattern}}><div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110" style={{background:`linear-gradient(135deg, ${f.color}30 0%, ${f.color}10 100%)`,border:`1px solid ${f.color}60`,boxShadow:`0 0 16px ${f.color}40`}}><f.icon size={22} color={f.color} strokeWidth={1.8} /></div><h3 className="font-display text-lg font-semibold text-white mb-2">{f.title}</h3><p className="text-sp-text2 text-sm leading-relaxed mb-3">{f.desc}</p>{f.showMap && <div className="map-preview mt-2" />}</motion.div></Reveal>))}</div></div></section>

      {/* SECCIÓN IA GENERATIVA */}
      <section id="ia" className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 -z-10" style={{ background: "radial-gradient(ellipse at center, rgba(212,175,55,0.08) 0%, transparent 60%)" }} />
        <div className="max-w-6xl mx-auto">
          <Reveal><div className="flex justify-center mb-6"><span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider" style={{ background: "linear-gradient(135deg, rgba(212,175,55,0.2), rgba(6,182,212,0.15))", border: "1px solid rgba(212,175,55,0.4)", color: "#D4AF37" }}><Wand2 size={12} /> Exclusivo · Primera plataforma con IA generativa</span></div></Reveal>
          <Reveal delay={0.1}><h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-center mb-4">No tienes fotos profesionales?<br /><span className="text-gradient-gold">No importa. La IA las crea.</span></h2></Reveal>
          <Reveal delay={0.2}><p className="text-lg sm:text-xl text-sp-text2 text-center max-w-3xl mx-auto mb-16">La primera plataforma de portafolios profesionales con <span className="text-sp-gold font-semibold">Inteligencia Artificial generativa</span> integrada. Escribe el nombre de tu servicio y la IA crea una imagen publicitaria profesional en segundos.</p></Reveal>
          <Reveal delay={0.3}>
            <div className="max-w-4xl mx-auto mb-20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <div className="card-glow relative p-6 rounded-2xl" style={{["--accent" as any]:"#6B7280",["--accent-glow" as any]:"rgba(107,114,128,0.2)"}}>
                  <div className="absolute -top-3 left-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase" style={{ background: "#6B7280", color: "white" }}>Sin IA</div>
                  <div className="aspect-video rounded-lg flex items-center justify-center mb-4" style={{ background: "rgba(107,114,128,0.1)", border: "2px dashed rgba(107,114,128,0.4)" }}>
                    <div className="text-center"><ImagePlus size={32} className="text-sp-text2/40 mx-auto mb-2" /><p className="text-xs text-sp-text2/60">"Corte de cabello" o "Inyección"</p><p className="text-[10px] text-sp-text2/40 mt-1">Sin foto, catálogo vacío</p></div>
                  </div>
                  <p className="text-xs text-sp-text2/70 text-center">❌ Sin imagen, los clientes no se animan</p>
                </div>
                <div className="card-glow relative p-6 rounded-2xl overflow-hidden" style={{["--accent" as any]:"#D4AF37",["--accent-glow" as any]:"rgba(212,175,55,0.3)"}}>
                  <div className="absolute -top-3 left-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase" style={{ background: "linear-gradient(135deg, #D4AF37, #F4D88A)", color: "#061520" }}>✨ Con IA</div>
                  <div className="aspect-video rounded-lg flex items-center justify-center mb-4 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0D9488 0%, #06B6D4 50%, #D4AF37 100%)" }}>
                    {/* Mockup IA Generativa - ícono de IA con efectos */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      {/* Icono de IA central con glow */}
                      <motion.div
                        animate={{
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, -5, 0],
                        }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="relative"
                      >
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.95)", boxShadow: "0 0 40px rgba(255,255,255,0.6), 0 0 80px rgba(212,175,55,0.4)" }}>
                          <Bot size={36} className="text-sp-bg" strokeWidth={1.8} />
                        </div>
                        {/* Sparkles alrededor */}
                        <motion.div
                          animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity, delay: 0 }}
                          className="absolute -top-2 -right-2"
                        >
                          <Sparkles size={16} className="text-white" fill="#D4AF37" />
                        </motion.div>
                        <motion.div
                          animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                          className="absolute -bottom-1 -left-2"
                        >
                          <Sparkles size={12} className="text-white" fill="#D4AF37" />
                        </motion.div>
                        <motion.div
                          animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                          className="absolute top-1/2 -right-4"
                        >
                          <Sparkles size={10} className="text-white" fill="#FFFFFF" />
                        </motion.div>
                      </motion.div>
                      {/* Texto "AI" debajo */}
                      <p className="text-[10px] text-white/95 font-bold tracking-[0.3em] mt-2">AI GENERATIVA</p>
                    </div>
                    <div className="absolute top-2 right-2 text-[8px] px-1.5 py-0.5 rounded-full font-bold uppercase flex items-center gap-0.5" style={{ background: "rgba(255,255,255,0.95)", color: "#061520" }}><Sparkles size={8} /> Generada con IA</div>
                  </div>
                  <p className="text-xs text-sp-gold text-center font-medium">✓ Imagen profesional en 10 segundos</p>
                </div>
              </div>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {[{icon:FileText,num:"01",title:"Escribes el servicio",desc:"Solo escribe el nombre del servicio. Sin pensar en prompts complicados.",color:"#0D9488"},{icon:Bot,num:"02",title:"La IA hace magia",desc:"Gemini 3.5 Flash mejora tu descripción e Imagen 3 crea la foto publicitaria.",color:"#06B6D4"},{icon:Sparkles,num:"03",title:"Portafolio profesional",desc:"Tu catálogo se ve increíble sin que hayas tocado una cámara.",color:"#D4AF37"}].map((step,i)=>(
              <Reveal key={step.num} delay={0.15+i*0.1}>
                <motion.div whileHover={{ y: -6 }} className="card-glow relative p-8 rounded-2xl h-full" style={{["--accent" as any]:step.color,["--accent-glow" as any]:`${step.color}30`}}>
                  <div className="absolute -top-4 -left-4 w-14 h-14 rounded-2xl flex items-center justify-center font-display font-bold text-xl text-white" style={{ background: `linear-gradient(135deg, ${step.color} 0%, ${step.color}cc 100%)`, boxShadow: `0 0 20px ${step.color}50` }}>{step.num}</div>
                  <div className="mt-6 mb-4"><step.icon size={32} color={step.color} strokeWidth={1.5} /></div>
                  <h3 className="font-display text-xl font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-sp-text2 text-sm leading-relaxed">{step.desc}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.4}>
            <div className="max-w-3xl mx-auto p-8 md:p-10 rounded-3xl text-center" style={{ background: "linear-gradient(135deg, rgba(212,175,55,0.12), rgba(6,182,212,0.1))", border: "1px solid rgba(212,175,55,0.3)", boxShadow: "0 20px 60px rgba(212,175,55,0.15)" }}>
              <div className="flex justify-center mb-4"><div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #D4AF37, #F4D88A)" }}><Wand2 size={28} className="text-sp-bg" /></div></div>
              <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-3">¿No sabes sacar fotos profesionales?<br /><span className="text-gradient-gold">Tampoco necesitas hacerlo.</span></h3>
              <p className="text-sp-text2 text-base mb-6 max-w-2xl mx-auto">Mientras tus competidores siguen buscando cómo tomar una foto decente con el celular, tú ya tienes un catálogo profesional generado por IA. Tu tiempo vale más.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                <a href={W} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-sp-bg transition-all hover:scale-[1.02]" style={{ background: "linear-gradient(135deg, #D4AF37, #F4D88A)", boxShadow: "0 0 40px rgba(212,175,55,0.4)" }}>¡La quiero! <ArrowRight size={18} /></a>
                <span className="text-xs text-sp-text2">Incluido en todos los planes</span>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.5}>
            <div className="max-w-2xl mx-auto mt-12 text-center">
              <div className="flex justify-center gap-1 mb-3">{[1,2,3,4,5].map(i=><Star key={i} size={16} className="text-sp-gold" fill="#D4AF37" />)}</div>
              <p className="text-lg italic text-white mb-3">"Generé 5 imágenes de mis servicios en 2 minutos. Mis clientes me preguntan quién me las tomó. ¡Nadie cree que las hizo una IA!"</p>
              <p className="text-sm text-sp-text2">— Profesional que prefiere no mostrar su nombre 😉</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* PRECIOS */}
      <section id="precios" className="relative py-24 px-6"><div className="max-w-6xl mx-auto"><div className="text-center mb-16"><Reveal><Eyebrow color="gold">Planes</Eyebrow></Reveal><Reveal delay={0.1}><h2 className="font-display text-4xl sm:text-5xl font-bold mt-6 mb-4">Precios <span className="text-gradient-gold">simples</span></h2></Reveal><Reveal delay={0.15}><p className="text-sp-text2 text-sm max-w-2xl mx-auto">Todos los planes incluyen <span className="text-sp-gold font-medium">✨ IA Generativa</span> — sin costo extra de configuración.</p></Reveal></div><div className="grid grid-cols-1 md:grid-cols-3 gap-6">{[{name:"Gratis",price:0,period:"15 días",desc:"Para probar",color:"#0D9488",featured:false,features:["Portafolio completo","5 servicios","✨ 1 imagen IA por servicio","Sin QR"]},{name:"Pro",price:15,period:"mes",desc:"Para profesionales",color:"#D4AF37",featured:true,features:["Todo lo del Gratis","Servicios ilimitados","✨ 5 imágenes IA por servicio/mes","QR descargable","Estadísticas"]},{name:"Premium",price:25,period:"mes",desc:"Para clínicas y negocios",color:"#06B6D4",featured:false,features:["Todo lo del Pro","✨ IA ilimitada","Multi-sede","Dominio propio","API access"]}].map((plan,i)=>(<Reveal key={plan.name} delay={i*0.1}><motion.div whileHover={{ y: -8 }} className={`relative p-8 rounded-2xl overflow-hidden h-full ${plan.featured?"border-gradient shadow-glow-gold":"glass"}`}>{plan.featured&&<div className="absolute top-4 right-4"><span className="px-3 py-1 rounded-full text-xs font-bold uppercase text-sp-bg" style={{background:"linear-gradient(135deg, #D4AF37, #F4D88A)"}}>Recomendado</span></div>}<h3 className="font-display text-2xl font-bold text-white mb-1">{plan.name}</h3><p className="text-sm text-sp-text2 mb-6">{plan.desc}</p><div className="flex items-baseline gap-2 mb-8"><span className="text-sm text-sp-text2/70">${plan.price}</span><span className="font-display text-5xl font-bold" style={{color:plan.color}}>{plan.price===0?"0":plan.price}</span><span className="text-sm text-sp-text2/70">/{plan.period}</span></div><ul className="space-y-3 mb-8">{plan.features.map(f=><li key={f} className="flex items-start gap-2 text-sm text-sp-text2"><Check size={16} color={plan.color} className="flex-shrink-0 mt-0.5" />{f}</li>)}</ul><a href={`https://wa.me/584225507708?text=${encodeURIComponent(`Hola Reinaldo, quiero el plan ${plan.name} de SaludPro`)}`} target="_blank" rel="noopener noreferrer" className="block text-center py-3 rounded-xl font-semibold text-sm transition-all hover:scale-[1.02]" style={plan.featured?{background:"linear-gradient(135deg, #D4AF37, #B8941F)",color:"#061520"}:{background:`${plan.color}30`,color:"#FFFFFF",border:`1px solid ${plan.color}50`}}>{plan.price===0?"Solicitar":"Quiero este plan"}</a></motion.div></Reveal>))}</div></div></section>

      {/* CTA FINAL */}
      <section className="relative py-32 px-6"><div className="max-w-4xl mx-auto text-center"><Reveal><div className="flex justify-center mb-8"><SaludProLogo size={80} /></div></Reveal><Reveal delay={0.1}><h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold mb-6">¿Listo para tu portafolio<br /><span className="text-gradient-teal">profesional?</span></h2></Reveal><Reveal delay={0.2}><p className="text-lg text-sp-text2 mb-10 max-w-2xl mx-auto">Únete a los profesionales que ya están creciendo con SaludPro.</p></Reveal><Reveal delay={0.3}><a href={W} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-10 py-5 rounded-full font-bold text-sp-bg transition-all hover:scale-[1.02]" style={{background:"linear-gradient(135deg, #0D9488, #06B6D4)",boxShadow:"0 0 60px rgba(13,148,136,0.5)"}}>Solicitar mi portafolio<ArrowRight size={20} /></a></Reveal></div></section>

      {/* FOOTER */}
      <footer className="relative border-t border-white/5 py-12 px-6"><div className="max-w-7xl mx-auto"><div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8"><div><SaludProLogoFull size={36} /><p className="text-xs text-sp-text2/60 mt-4">Plataforma para profesionales de la salud, la belleza, el fitness y el bienestar.</p></div><div><h4 className="font-display text-sm font-semibold text-white mb-3">Soporte</h4><a href="https://wa.me/584225507708" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-sp-text2 hover:text-sp-teal-light mb-2"><MessageCircle size={16} className="text-sp-health-green" />0422-550-7708</a></div><div><h4 className="font-display text-sm font-semibold text-white mb-3">Powered by</h4><p className="text-sm text-white font-semibold">Reinaldo Morales</p><p className="text-xs text-sp-text2">Soluciones Digitales & IA</p></div></div><div className="border-t border-white/5 pt-6 text-center"><p className="text-xs text-sp-text2/60">© 2026 SaludPro · <span className="text-sp-teal-light">Reinaldo Morales</span> · Soluciones Digitales & IA</p><a href="/super-admin/login" className="inline-flex items-center gap-1.5 mt-3 text-[10px] text-sp-gold/50 hover:text-sp-gold"><Shield size={10} />Acceso Super Admin</a></div></div></footer>
    </main>
  );
}
