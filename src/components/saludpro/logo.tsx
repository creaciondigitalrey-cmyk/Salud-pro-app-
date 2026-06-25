"use client";
import { motion } from "framer-motion";

export function SaludProLogo({ size = 40, animated = true }: { size?: number; animated?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: "drop-shadow(0 0 12px rgba(0, 229, 255, 0.5))" }}
    >
      <defs>
        {/* Gradiente del borde */}
        <linearGradient id="sp-border-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00E5FF" />
          <stop offset="50%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#0D9488" />
        </linearGradient>
        {/* Gradiente del fondo interno */}
        <linearGradient id="sp-bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#003D4D" />
          <stop offset="100%" stopColor="#001F2A" />
        </linearGradient>
        {/* Gradiente de la cruz */}
        <linearGradient id="sp-cross-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00E5FF" />
          <stop offset="100%" stopColor="#2DD4BF" />
        </linearGradient>
        {/* Gradiente de la línea ECG */}
        <linearGradient id="sp-ecg-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="20%" stopColor="#FFFFFF" stopOpacity="1" />
          <stop offset="80%" stopColor="#FFFFFF" stopOpacity="1" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        {/* Filtro de glow para la línea ECG */}
        <filter id="sp-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* Filtro de glow más intenso para el punto dorado */}
        <filter id="sp-gold-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* Clip para que la línea no se salga del cuadrado */}
        <clipPath id="sp-clip">
          <rect x="6" y="6" width="88" height="88" rx="20" ry="20" />
        </clipPath>
      </defs>

      {/* Cuadrado redondeado principal con borde gradiente y glow */}
      <rect
        x="3"
        y="3"
        width="94"
        height="94"
        rx="22"
        ry="22"
        fill="url(#sp-bg-grad)"
        stroke="url(#sp-border-grad)"
        strokeWidth="2.5"
      />

      {/* Cruz médica cian (detrás de la línea ECG) */}
      <g stroke="url(#sp-cross-grad)" strokeWidth="4.5" strokeLinecap="round" opacity="0.7" filter="url(#sp-glow)">
        <line x1="50" y1="22" x2="50" y2="78" />
        <line x1="22" y1="50" x2="78" y2="50" />
      </g>

      {/* LÍNEA INFINITA ECG — efecto de monitor médico real */}
      <g clipPath="url(#sp-clip)">
        {animated ? (
          <>
            {/* Línea base tenue (estela) - siempre visible de fondo */}
            <path
              d="M 0 50 L 100 50"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="1"
              strokeLinecap="round"
              fill="none"
            />

            {/* Grupo animado que se mueve horizontalmente infinitamente */}
            <motion.g
              animate={{
                x: [0, -50, -100],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              {/* Patrón ECG repetido 3 veces para loop perfecto */}
              {[0, 50, 100, 150].map((offset, i) => (
                <g key={i} transform={`translate(${offset - 25}, 0)`}>
                  {/* Línea ECG principal con glow */}
                  <path
                    d="M 0 50 L 15 50 L 18 48 L 21 52 L 24 42 L 27 58 L 30 38 L 33 62 L 36 50 L 50 50"
                    stroke="url(#sp-ecg-grad)"
                    strokeWidth="2.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                    filter="url(#sp-glow)"
                  />
                  {/* Punto dorado en el pico más bajo de cada onda */}
                  <motion.circle
                    cx="33"
                    cy="62"
                    r="2.5"
                    fill="#FFD700"
                    filter="url(#sp-gold-glow)"
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0.5, 1.3, 0.5],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                      delay: i * 0,
                    }}
                  />
                </g>
              ))}
            </motion.g>

            {/* Punto "cabezal" que simula el lápiz dibujando (siempre al frente) */}
            <motion.circle
              cx="50"
              cy="50"
              r="3"
              fill="#FFFFFF"
              filter="url(#sp-glow)"
              animate={{
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </>
        ) : (
          /* Versión estática (sin animación) */
          <g>
            <path
              d="M 25 50 L 40 50 L 43 48 L 46 52 L 49 42 L 52 58 L 55 38 L 58 62 L 61 50 L 75 50"
              stroke="white"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              filter="url(#sp-glow)"
            />
            <circle cx="58" cy="62" r="2.5" fill="#FFD700" filter="url(#sp-gold-glow)" />
          </g>
        )}
      </g>
    </svg>
  );
}

export function SaludProLogoFull({ size = 40, animated = true }: { size?: number; animated?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <SaludProLogo size={size} animated={animated} />
      <div>
        <p className="font-display font-bold text-white leading-none" style={{ fontSize: size * 0.42 }}>
          <span className="text-white">Salud</span>
          <span className="text-gradient-teal">Pro</span>
        </p>
        <p className="text-[9px] text-sp-text2 uppercase tracking-[0.2em] leading-none mt-1">Salud · Tech · Pro</p>
      </div>
    </div>
  );
}
