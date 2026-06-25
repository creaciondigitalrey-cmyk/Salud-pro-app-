export type ProfessionId = "enfermera" | "medico-general" | "medico-especialista" | "psicologo" | "fisioterapeuta" | "nutricionista" | "odontologo" | "pediatra" | "cuidador-adultos" | "doula" | "clinica" | "oftalmologo" | "podologo" | "entrenador" | "esteticista" | "nail-artist" | "estilista";
export interface ServiceTemplate { nombre: string; descripcion: string; precio: number; duracion: string; }
export interface CatalogTemplate { titulo: string; descripcion: string; precio?: number; duracion?: string; tags: string[]; }
export interface ProfessionConfig {
  id: ProfessionId;
  label: string;
  singular: string;
  emoji: string;
  icon: string;
  accent: string;
  accentLight: string;
  descripcion: string;
  categoria: "salud" | "belleza" | "barberia" | "fitness" | "pies";
  serviciosDefault: ServiceTemplate[];
  catalogoDefault: CatalogTemplate[];
  secciones: { certificaciones: boolean; ubicacion: boolean; testimonios: boolean; agenda: boolean; pagos: boolean; };
}

export const PROFESSIONS: Record<ProfessionId, ProfessionConfig> = {
  // ==================== 🩺 SALUD Y MEDICINA (12) ====================
  enfermera: {
    id: "enfermera", label: "Enfermería", singular: "Enfermera/o", emoji: "💉", icon: "Syringe",
    accent: "#0D9488", accentLight: "#2DD4BF", descripcion: "Servicios de enfermería a domicilio.",
    categoria: "salud",
    serviciosDefault: [
      { nombre: "Inyección IM", descripcion: "Aplicación intramuscular con técnica aséptica y material estéril desechable.", precio: 5, duracion: "15 min" },
      { nombre: "Inyección EV", descripcion: "Aplicación endovenosa con seguimiento post-aplicación.", precio: 8, duracion: "20 min" },
      { nombre: "Cura de heridas", descripcion: "Limpieza, desinfección y vendaje de heridas postoperatorias o crónicas.", precio: 15, duracion: "30 min" },
      { nombre: "Cuidado paciente crónico", descripcion: "Atención integral a pacientes encamados o con condiciones crónicas.", precio: 25, duracion: "4 horas" },
      { nombre: "Toma de muestra de sangre", descripcion: "Extracción de sangre para exámenes de laboratorio en casa.", precio: 10, duracion: "20 min" },
      { nombre: "Control de signos vitales", descripcion: "Medición de PA, glucemia, temperatura, saturación y frecuencia cardíaca.", precio: 5, duracion: "15 min" }
    ],
    catalogoDefault: [
      { titulo: "Inyección profesional a domicilio", descripcion: "Servicio de aplicación de medicamentos con técnica aséptica y material estéril desechable.", precio: 5, duracion: "15 min", tags: ["domicilio", "inyeccion", "urgente"] },
      { titulo: "Cura de heridas postoperatorias", descripcion: "Atención especializada de heridas quirúrgicas con material estéril y seguimiento.", precio: 15, duracion: "30 min", tags: ["cura", "postoperatorio"] },
      { titulo: "Toma de muestras de laboratorio", descripcion: "Extracción de sangre y muestras para análisis sin salir de casa.", precio: 10, duracion: "20 min", tags: ["laboratorio", "sangre"] }
    ],
    secciones: { certificaciones: true, ubicacion: true, testimonios: true, agenda: true, pagos: true }
  },

  "medico-general": {
    id: "medico-general", label: "Medicina General", singular: "Médico/a General", emoji: "🩺", icon: "Stethoscope",
    accent: "#1E3A8A", accentLight: "#3B82F6", descripcion: "Consultas médicas generales y telemedicina.",
    categoria: "salud",
    serviciosDefault: [
      { nombre: "Consulta general", descripcion: "Evaluación clínica completa y plan de tratamiento personalizado.", precio: 30, duracion: "30 min" },
      { nombre: "Teleconsulta", descripcion: "Consulta médica virtual por videollamada con receta digital.", precio: 20, duracion: "30 min" },
      { nombre: "Control de paciente crónico", descripcion: "Seguimiento mensual de hipertensión, diabetes y condiciones crónicas.", precio: 25, duracion: "30 min" },
      { nombre: "Certificado médico", descripcion: "Emisión de certificados médicos para trabajo, deportivos y escolares.", precio: 15, duracion: "15 min" },
      { nombre: "Receta médica digital", descripcion: "Receta médica firmada digitalmente enviada por WhatsApp.", precio: 10, duracion: "10 min" }
    ],
    catalogoDefault: [
      { titulo: "Consulta médica general", descripcion: "Evaluación clínica completa con diagnóstico y plan de tratamiento personalizado.", precio: 30, duracion: "30 min", tags: ["consulta", "general"] },
      { titulo: "Teleconsulta 24/7", descripcion: "Atención médica virtual por videollamada desde cualquier lugar.", precio: 20, duracion: "30 min", tags: ["virtual", "telemedicina"] }
    ],
    secciones: { certificaciones: true, ubicacion: true, testimonios: true, agenda: true, pagos: true }
  },

  "medico-especialista": {
    id: "medico-especialista", label: "Medicina Especializada", singular: "Médico/a Especialista", emoji: "👨‍⚕️", icon: "UserRound",
    accent: "#1E40AF", accentLight: "#60A5FA", descripcion: "Consultas especializadas por área médica.",
    categoria: "salud",
    serviciosDefault: [
      { nombre: "Consulta especializada", descripcion: "Evaluación por médico especialista con diagnóstico y plan integral.", precio: 60, duracion: "45 min" },
      { nombre: "Teleconsulta especializada", descripcion: "Seguimiento virtual con especialista por videollamada.", precio: 40, duracion: "45 min" },
      { nombre: "Segunda opinión médica", descripcion: "Revisión de diagnósticos y tratamientos previos por especialista.", precio: 50, duracion: "45 min" }
    ],
    catalogoDefault: [
      { titulo: "Consulta con especialista", descripcion: "Atención por médico especialista con diagnóstico y tratamiento avanzado.", precio: 60, duracion: "45 min", tags: ["especialista", "consulta"] }
    ],
    secciones: { certificaciones: true, ubicacion: true, testimonios: true, agenda: true, pagos: true }
  },

  psicologo: {
    id: "psicologo", label: "Psicología", singular: "Psicólogo/a", emoji: "🧠", icon: "Brain",
    accent: "#7C3AED", accentLight: "#A78BFA", descripcion: "Terapia psicológica individual, pareja y familiar.",
    categoria: "salud",
    serviciosDefault: [
      { nombre: "Terapia individual", descripcion: "Sesión de terapia psicológica individual con enfoque cognitivo-conductual.", precio: 30, duracion: "50 min" },
      { nombre: "Terapia de pareja", descripcion: "Sesiones para parejas con conflictos de comunicación o relaciónales.", precio: 50, duracion: "1 hora" },
      { nombre: "Terapia online", descripcion: "Sesiones virtuales con la misma calidad que la presencial.", precio: 25, duracion: "50 min" },
      { nombre: "Primera entrevista", descripcion: "Evaluación inicial para conocer el caso y diseñar el plan terapéutico.", precio: 35, duracion: "1 hora" }
    ],
    catalogoDefault: [
      { titulo: "Terapia psicológica individual", descripcion: "Espacio seguro y confidencial para tu bienestar emocional.", precio: 30, duracion: "50 min", tags: ["terapia", "ansiedad", "depresion"] },
      { titulo: "Terapia de pareja", descripcion: "Reconstruye la comunicación y conexión con tu pareja.", precio: 50, duracion: "1 hora", tags: ["pareja", "relacion"] }
    ],
    secciones: { certificaciones: true, ubicacion: true, testimonios: true, agenda: true, pagos: true }
  },

  fisioterapeuta: {
    id: "fisioterapeuta", label: "Fisioterapia", singular: "Fisioterapeuta", emoji: "💪", icon: "Dumbbell",
    accent: "#0284C7", accentLight: "#38BDF8", descripcion: "Rehabilitación, masajes terapéuticos y recuperación física.",
    categoria: "salud",
    serviciosDefault: [
      { nombre: "Sesión de fisioterapia", descripcion: "Evaluación y tratamiento de lesiones musculoesqueléticas.", precio: 35, duracion: "1 hora" },
      { nombre: "Masaje terapéutico", descripcion: "Masaje de descarga para dolor muscular y tensión acumulada.", precio: 30, duracion: "45 min" },
      { nombre: "Fisioterapia en casa", descripcion: "Sesiones a domicilio para pacientes con movilidad reducida.", precio: 50, duracion: "1 hora" },
      { nombre: "Rehabilitación post-quirúrgica", descripcion: "Programa de recuperación después de cirugía ortopédica.", precio: 40, duracion: "1 hora" }
    ],
    catalogoDefault: [
      { titulo: "Sesión de fisioterapia", descripcion: "Recupera tu movilidad con tratamiento profesional personalizado.", precio: 35, duracion: "1 hora", tags: ["rehabilitacion", "dolor"] },
      { titulo: "Masaje terapéutico", descripcion: "Alivia la tensión muscular y mejora tu bienestar físico.", precio: 30, duracion: "45 min", tags: ["masaje", "relajacion"] }
    ],
    secciones: { certificaciones: true, ubicacion: true, testimonios: true, agenda: true, pagos: true }
  },

  nutricionista: {
    id: "nutricionista", label: "Nutrición", singular: "Nutricionista", emoji: "🍎", icon: "Apple",
    accent: "#EA580C", accentLight: "#FB923C", descripcion: "Planes alimentarios personalizados y seguimiento nutricional.",
    categoria: "salud",
    serviciosDefault: [
      { nombre: "Consulta nutricional", descripcion: "Evaluación nutricional completa con plan alimentario personalizado.", precio: 35, duracion: "1 hora" },
      { nombre: "Plan alimentario mensual", descripcion: "Plan completo con menús, recetas y lista de compras.", precio: 60, duracion: "1.5 horas" },
      { nombre: "Seguimiento virtual", descripcion: "Sesiones de seguimiento semanal por videollamada.", precio: 20, duracion: "30 min" },
      { nombre: "Plan deportivo", descripcion: "Nutrición especializada para deportistas y fitness.", precio: 50, duracion: "1 hora" }
    ],
    catalogoDefault: [
      { titulo: "Plan nutricional personalizado", descripcion: "Alcanza tus metas de salud con un plan diseñado para ti.", precio: 60, duracion: "1.5 horas", tags: ["nutricion", "dieta", "salud"] }
    ],
    secciones: { certificaciones: true, ubicacion: true, testimonios: true, agenda: true, pagos: true }
  },

  odontologo: {
    id: "odontologo", label: "Odontología", singular: "Odontólogo/a", emoji: "🦷", icon: "Smile",
    accent: "#0891B2", accentLight: "#22D3EE", descripcion: "Salud dental integral y estética.",
    categoria: "salud",
    serviciosDefault: [
      { nombre: "Consulta odontológica", descripcion: "Evaluación dental completa con diagnóstico y plan de tratamiento.", precio: 25, duracion: "30 min" },
      { nombre: "Limpieza dental", descripcion: "Profilaxis profesional con ultrasonido y pulido.", precio: 40, duracion: "45 min" },
      { nombre: "Blanqueamiento dental", descripcion: "Tratamiento de blanqueamiento profesional en sesión única.", precio: 120, duracion: "1 hora" },
      { nombre: "Empaste dental", descripcion: "Restauración de caries con material estético.", precio: 50, duracion: "45 min" }
    ],
    catalogoDefault: [
      { titulo: "Limpieza dental profesional", descripcion: "Mantén tu sonrisa saludable con profilaxis profesional.", precio: 40, duracion: "45 min", tags: ["limpieza", "salud-dental"] },
      { titulo: "Blanqueamiento dental", descripcion: "Sonrisa radiante en una sola sesión.", precio: 120, duracion: "1 hora", tags: ["estetica", "blanqueamiento"] }
    ],
    secciones: { certificaciones: true, ubicacion: true, testimonios: true, agenda: true, pagos: true }
  },

  pediatra: {
    id: "pediatra", label: "Pediatría", singular: "Pediatra", emoji: "👶", icon: "Baby",
    accent: "#2563EB", accentLight: "#60A5FA", descripcion: "Atención médica integral para infantes y adolescentes.",
    categoria: "salud",
    serviciosDefault: [
      { nombre: "Consulta pediátrica", descripcion: "Evaluación del niño con diagnóstico y plan de tratamiento.", precio: 35, duracion: "40 min" },
      { nombre: "Control de niño sano", descripcion: "Chequeo rutinario con seguimiento de crecimiento y desarrollo.", precio: 30, duracion: "30 min" },
      { nombre: "Vacunación", descripcion: "Aplicación de vacunas según esquema nacional.", precio: 15, duracion: "20 min" }
    ],
    catalogoDefault: [
      { titulo: "Consulta pediátrica", descripcion: "Atención especializada para tu pequeño con diagnóstico y tratamiento.", precio: 35, duracion: "40 min", tags: ["pediatria", "ninos"] }
    ],
    secciones: { certificaciones: true, ubicacion: true, testimonios: true, agenda: true, pagos: true }
  },

  "cuidador-adultos": {
    id: "cuidador-adultos", label: "Cuidado de Adultos Mayores", singular: "Cuidador/a", emoji: "🧓", icon: "Heart",
    accent: "#92400E", accentLight: "#D4AF37", descripcion: "Acompañamiento y cuidado integral de adultos mayores.",
    categoria: "salud",
    serviciosDefault: [
      { nombre: "Acompañamiento día", descripcion: "Cuidado y compañía durante el día con atención a necesidades básicas.", precio: 40, duracion: "8 horas" },
      { nombre: "Acompañamiento noche", descripcion: "Cuidado nocturno para adultos mayores que requieren supervisión.", precio: 35, duracion: "12 horas" },
      { nombre: "Cuidado 24 horas", descripcion: "Cuidado integral día y noche con enfermero/cuidador especializado.", precio: 80, duracion: "24 horas" }
    ],
    catalogoDefault: [
      { titulo: "Acompañamiento de adultos mayores", descripcion: "Cuidado profesional y cariñoso para tu ser querido en casa.", precio: 40, duracion: "8 horas", tags: ["adultos-mayores", "cuidado"] }
    ],
    secciones: { certificaciones: true, ubicacion: true, testimonios: true, agenda: true, pagos: true }
  },

  doula: {
    id: "doula", label: "Doula / Obstetricia", singular: "Doula", emoji: "🤰", icon: "HeartHandshake",
    accent: "#DB2777", accentLight: "#F472B6", descripcion: "Acompañamiento emocional y físico durante embarazo y posparto.",
    categoria: "salud",
    serviciosDefault: [
      { nombre: "Acompañamiento prenatal", descripcion: "Sesiones durante el embarazo para preparación física y emocional.", precio: 40, duracion: "1.5 horas" },
      { nombre: "Visita posparto", descripcion: "Apoyo en los primeros días después del parto en casa.", precio: 50, duracion: "2 horas" },
      { nombre: "Paquete completo", descripcion: "Acompañamiento durante todo el embarazo, parto y posparto.", precio: 250, duracion: "Variable" }
    ],
    catalogoDefault: [
      { titulo: "Acompañamiento doula", descripcion: "Vive tu embarazo y parto con apoyo emocional profesional.", precio: 40, duracion: "1.5 horas", tags: ["doula", "embarazo", "posparto"] }
    ],
    secciones: { certificaciones: true, ubicacion: true, testimonios: true, agenda: true, pagos: true }
  },

  clinica: {
    id: "clinica", label: "Clínica / Consultorio", singular: "Clínica", emoji: "🏥", icon: "Building2",
    accent: "#1E40AF", accentLight: "#3B82F6", descripcion: "Centro médico con múltiples especialidades.",
    categoria: "salud",
    serviciosDefault: [
      { nombre: "Consulta general", descripcion: "Atención médica general con diagnóstico y tratamiento.", precio: 25, duracion: "30 min" },
      { nombre: "Consulta especializada", descripcion: "Atención por médico especialista en el área requerida.", precio: 50, duracion: "45 min" },
      { nombre: "Exámenes preventivos", descripcion: "Chequeos médicos completos para prevención.", precio: 80, duracion: "2 horas" }
    ],
    catalogoDefault: [
      { titulo: "Consulta médica", descripcion: "Atención profesional en clínica equipada.", precio: 25, duracion: "30 min", tags: ["clinica", "consulta"] }
    ],
    secciones: { certificaciones: true, ubicacion: true, testimonios: true, agenda: true, pagos: true }
  },

  oftalmologo: {
    id: "oftalmologo", label: "Oftalmología", singular: "Oftalmólogo/a", emoji: "👁️", icon: "Eye",
    accent: "#1E3A8A", accentLight: "#3B82F6", descripcion: "Salud visual integral y cirugía ocular.",
    categoria: "salud",
    serviciosDefault: [
      { nombre: "Consulta oftalmológica", descripcion: "Examen completo de la salud visual con diagnóstico.", precio: 40, duracion: "45 min" },
      { nombre: "Examen de refracción", descripcion: "Medición para graduación de lentes.", precio: 25, duracion: "30 min" },
      { nombre: "Fondo de ojo", descripcion: "Evaluación de retina y estructuras internas del ojo.", precio: 35, duracion: "30 min" }
    ],
    catalogoDefault: [
      { titulo: "Examen visual completo", descripcion: "Cuida tu salud visual con evaluación profesional.", precio: 40, duracion: "45 min", tags: ["oftalmologia", "vision"] }
    ],
    secciones: { certificaciones: true, ubicacion: true, testimonios: true, agenda: true, pagos: true }
  },

  // ==================== 💅 BELLEZA Y ESTÉTICA (2) ====================
  esteticista: {
    id: "esteticista", label: "Estética y Belleza", singular: "Esteticista", emoji: "💆", icon: "Sparkles",
    accent: "#F472B6", accentLight: "#F9A8D4", descripcion: "Tratamientos estéticos faciales, corporales y relajación.",
    categoria: "belleza",
    serviciosDefault: [
      { nombre: "Limpieza facial profunda", descripcion: "Limpieza profesional con extracción, mascarilla y tratamiento.", precio: 40, duracion: "1 hora" },
      { nombre: "Masaje relajante", descripcion: "Masaje anti-estrés con aceites esenciales aromáticos.", precio: 35, duracion: "1 hora" },
      { nombre: "Drenaje linfático", descripcion: "Técnica manual para reducir retención de líquidos.", precio: 45, duracion: "1 hora" },
      { nombre: "Tratamiento antiedad", descripcion: "Sesión con ácido hialurónico y radiofrecuencia facial.", precio: 60, duracion: "1 hora" },
      { nombre: "Mampara de pestañas", descripcion: "Aplicación profesional de pestañas pelo a pelo.", precio: 30, duracion: "1.5 horas" },
      { nombre: "Depilación láser", descripcion: "Sesión de depilación láser definitiva por zona.", precio: 35, duracion: "30 min" }
    ],
    catalogoDefault: [
      { titulo: "Limpieza facial profunda", descripcion: "Piel renovada y radiante con protocolo profesional completo.", precio: 40, duracion: "1 hora", tags: ["facial", "belleza", "limpieza"] },
      { titulo: "Masaje relajante con aromaterapia", descripcion: "Desconecta del estrés con masaje holístico y aceites esenciales.", precio: 35, duracion: "1 hora", tags: ["masaje", "relajacion"] },
      { titulo: "Tratamiento antiedad facial", descripcion: "Reduce líneas de expresión con tecnología de última generación.", precio: 60, duracion: "1 hora", tags: ["antiedad", "radiofrecuencia"] },
      { titulo: "Mampara de pestañas profesional", descripcion: "Mirada impactante con pestañas pelo a pelo de alta calidad.", precio: 30, duracion: "1.5 horas", tags: ["pestanas", "mampara"] }
    ],
    secciones: { certificaciones: true, ubicacion: true, testimonios: true, agenda: true, pagos: true }
  },

  "nail-artist": {
    id: "nail-artist", label: "Nail Artist & Beauty", singular: "Nail Artist", emoji: "💅", icon: "Hand",
    accent: "#F472B6", accentLight: "#FBBF24", descripcion: "Uñas acrílicas, gel, esmaltado semipermanente y beauty.",
    categoria: "belleza",
    serviciosDefault: [
      { nombre: "Manicura clásica", descripcion: "Manicura con esmaltado tradicional y limpieza de cutícula.", precio: 15, duracion: "45 min" },
      { nombre: "Uñas acrílicas", descripcion: "Extensión con acrílico de alta durabilidad y diseño personalizado.", precio: 35, duracion: "1.5 horas" },
      { nombre: "Uñas en gel (semipermanente)", descripcion: "Esmaltado semipermanente de larga duración (3 semanas).", precio: 25, duracion: "1 hora" },
      { nombre: "Perfilado de cejas", descripcion: "Diseño y depilación de cejas con técnica henna o cera.", precio: 12, duracion: "30 min" },
      { nombre: "Pedicura spa", descripcion: "Tratamiento completo de pies con masaje y esmaltado.", precio: 25, duracion: "1 hora" },
      { nombre: "Lifting de pestañas", descripcion: "Curvatura permanente de pestañas naturales.", precio: 30, duracion: "1 hora" },
      { nombre: "Diseño nail art", descripcion: "Diseños personalizados por uña con técnica mixta.", precio: 10, duracion: "30 min" }
    ],
    catalogoDefault: [
      { titulo: "Uñas acrílicas con diseño", descripcion: "Manos impecables con extensión acrílica y diseño personalizado.", precio: 35, duracion: "1.5 horas", tags: ["unas", "acrilico", "diseno"] },
      { titulo: "Esmaltado semipermanente", descripcion: "Color perfecto que dura hasta 3 semanas sin descamarse.", precio: 25, duracion: "1 hora", tags: ["gel", "semipermanente"] },
      { titulo: "Pedicura spa completa", descripcion: "Pies suaves y relajados con tratamiento profesional.", precio: 25, duracion: "1 hora", tags: ["pedicura", "spa"] },
      { titulo: "Perfilado de cejas con henna", descripcion: "Cejas definidas y simétricas con técnica profesional.", precio: 12, duracion: "30 min", tags: ["cejas", "henna"] }
    ],
    secciones: { certificaciones: true, ubicacion: true, testimonios: true, agenda: true, pagos: true }
  },

  // ==================== 💇 BARBERÍA Y PELUQUERÍA (1) ====================
  estilista: {
    id: "estilista", label: "Estilista / Barbero", singular: "Estilista / Barbero", emoji: "💇", icon: "Scissors",
    accent: "#EC4899", accentLight: "#D4AF37", descripcion: "Corte de cabello, peinado, color y barbería clásica.",
    categoria: "barberia",
    serviciosDefault: [
      { nombre: "Corte de cabello", descripcion: "Corte clásico o moderno con técnica de tijera o máquina.", precio: 12, duracion: "30 min" },
      { nombre: "Corte + Barba", descripcion: "Combo completo de corte de cabello y diseño de barba.", precio: 18, duracion: "45 min" },
      { nombre: "Afeitado tradicional", descripcion: "Afeitado a navaja con toalla caliente y productos premium.", precio: 10, duracion: "30 min" },
      { nombre: "Diseño de barba", descripcion: "Perfilado y diseño de barba con máquina y navaja.", precio: 8, duracion: "20 min" },
      { nombre: "Tinte de cabello", descripcion: "Coloración global o mechas con productos profesionales.", precio: 35, duracion: "1.5 horas" },
      { nombre: "Peinado para evento", descripcion: "Peinado profesional para eventos especiales.", precio: 25, duracion: "1 hora" },
      { nombre: "Tratamiento capilar", descripcion: "Hidratación profunda con ampollas y masaje.", precio: 20, duracion: "30 min" },
      { nombre: "Corte infantil", descripcion: "Corte para niños menores de 10 con paciencia y técnica.", precio: 8, duracion: "20 min" }
    ],
    catalogoDefault: [
      { titulo: "Corte de cabello profesional", descripcion: "Estilo que se adapta a tu rostro y personalidad.", precio: 12, duracion: "30 min", tags: ["corte", "cabello"] },
      { titulo: "Combo Corte + Barba", descripcion: "Look completo y bien definido en una sola sesión.", precio: 18, duracion: "45 min", tags: ["combo", "barba"] },
      { titulo: "Afeitado tradicional a navaja", descripcion: "Experiencia clásica con toalla caliente y ritual completo.", precio: 10, duracion: "30 min", tags: ["afeitado", "navaja"] },
      { titulo: "Diseño y perfilado de barba", descripcion: "Barba con estilo y definición profesional.", precio: 8, duracion: "20 min", tags: ["barba", "diseno"] }
    ],
    secciones: { certificaciones: true, ubicacion: true, testimonios: true, agenda: true, pagos: true }
  },

  // ==================== 🏋️ FITNESS Y ENTRENAMIENTO (1) ====================
  entrenador: {
    id: "entrenador", label: "Entrenamiento Personal", singular: "Entrenador/a Personal", emoji: "🏋️", icon: "Dumbbell",
    accent: "#F97316", accentLight: "#FB923C", descripcion: "Entrenamiento personalizado, planes fitness y asesoría deportiva.",
    categoria: "fitness",
    serviciosDefault: [
      { nombre: "Sesión personalizada 1-a-1", descripcion: "Entrenamiento individual con plan adaptado a tus objetivos.", precio: 25, duracion: "1 hora" },
      { nombre: "Plan mensual completo", descripcion: "Plan de 12 sesiones con seguimiento nutricional incluido.", precio: 200, duracion: "1 hora" },
      { nombre: "Entrenamiento en casa", descripcion: "Sesiones en tu hogar con equipo portátil.", precio: 30, duracion: "1 hora" },
      { nombre: "Asesoría online", descripcion: "Plan personalizado vía WhatsApp con videos y seguimiento.", precio: 50, duracion: "Variable" },
      { nombre: "Clases grupales", descripcion: "Entrenamiento en grupo de máximo 5 personas.", precio: 15, duracion: "1 hora" },
      { nombre: "Preparación física", descripcion: "Programa para atletas y competencias deportivas.", precio: 80, duracion: "1.5 horas" }
    ],
    catalogoDefault: [
      { titulo: "Sesión de entrenamiento personal", descripcion: "Alcanza tus metas fitness con guía profesional y técnica correcta.", precio: 25, duracion: "1 hora", tags: ["fitness", "entrenamiento"] },
      { titulo: "Plan mensual con nutrición", descripcion: "Transformación completa en 30 días con seguimiento integral.", precio: 200, duracion: "1 hora", tags: ["plan", "nutricion", "mensual"] },
      { titulo: "Entrenamiento en casa", descripcion: "Resultados sin salir de casa, equipo incluido.", precio: 30, duracion: "1 hora", tags: ["casa", "domicilio"] },
      { titulo: "Asesoría online con seguimiento", descripcion: "Plan a distancia con videos y soporte por WhatsApp.", precio: 50, duracion: "Variable", tags: ["online", "virtual"] }
    ],
    secciones: { certificaciones: true, ubicacion: true, testimonios: true, agenda: true, pagos: true }
  },

  // ==================== 🦶 CUIDADO DE PIES (1) ====================
  podologo: {
    id: "podologo", label: "Podología", singular: "Podólogo/a", emoji: "🦶", icon: "Footprints",
    accent: "#10B981", accentLight: "#34D399", descripcion: "Cuidado profesional de pies, uñas encarnadas y pie diabético.",
    categoria: "pies",
    serviciosDefault: [
      { nombre: "Consulta podológica", descripcion: "Evaluación completa de pies y uñas con diagnóstico.", precio: 25, duracion: "45 min" },
      { nombre: "Cuidado de pie diabético", descripcion: "Atención especializada para pacientes con diabetes.", precio: 35, duracion: "1 hora" },
      { nombre: "Tratamiento de uña encarnada", descripcion: "Corrección y tratamiento de onicocriptosis.", precio: 30, duracion: "45 min" },
      { nombre: "Limpieza y callosidad", descripcion: "Eliminación de callos, durezas y tratamiento hidratante.", precio: 20, duracion: "30 min" },
      { nombre: "Curas de uñas con hongos", descripcion: "Tratamiento antimicótico con seguimiento mensual.", precio: 25, duracion: "30 min" },
      { nombre: "Podología deportiva", descripcion: "Cuidado especializado para deportistas y corredores.", precio: 30, duracion: "45 min" }
    ],
    catalogoDefault: [
      { titulo: "Consulta podológica completa", descripcion: "Cuida tus pies con evaluación y tratamiento profesional.", precio: 25, duracion: "45 min", tags: ["podologia", "pies"] },
      { titulo: "Cuidado de pie diabético", descripcion: "Atención especial para pie de riesgo con protocolo médico.", precio: 35, duracion: "1 hora", tags: ["diabetes", "especializado"] },
      { titulo: "Tratamiento de uña encarnada", descripcion: "Solución definitiva al dolor con técnica profesional.", precio: 30, duracion: "45 min", tags: ["una", "encarnada"] },
      { titulo: "Limpieza profunda de pies", descripcion: "Pies suaves y libres de callosidades.", precio: 20, duracion: "30 min", tags: ["limpieza", "callos"] }
    ],
    secciones: { certificaciones: true, ubicacion: true, testimonios: true, agenda: true, pagos: true }
  },
};

export const PROFESSION_LIST = Object.values(PROFESSIONS);
export function getProfession(id: ProfessionId): ProfessionConfig { return PROFESSIONS[id] || PROFESSIONS.enfermera; }

// Agrupación por categoría para landing
export const CATEGORIAS: { id: string; label: string; emoji: string; accent: string; descripcion: string; profesiones: ProfessionId[] }[] = [
  { id: "salud", label: "Salud y Medicina", emoji: "🩺", accent: "#0D9488", descripcion: "Atención médica y cuidado clínico", profesiones: ["enfermera","medico-general","medico-especialista","psicologo","fisioterapeuta","nutricionista","odontologo","pediatra","cuidador-adultos","doula","clinica","oftalmologo"] },
  { id: "belleza", label: "Belleza y Estética", emoji: "💅", accent: "#F472B6", descripcion: "Cuidado estético facial y corporal", profesiones: ["esteticista","nail-artist"] },
  { id: "barberia", label: "Barbería y Peluquería", emoji: "💇", accent: "#EC4899", descripcion: "Corte, color y estilos", profesiones: ["estilista"] },
  { id: "fitness", label: "Fitness y Entrenamiento", emoji: "🏋️", accent: "#F97316", descripcion: "Entrenamiento personalizado", profesiones: ["entrenador"] },
  { id: "pies", label: "Cuidado de Pies", emoji: "🦶", accent: "#10B981", descripcion: "Podología y bienestar de pies", profesiones: ["podologo"] },
];
