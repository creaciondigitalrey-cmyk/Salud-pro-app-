"use client";
import { motion, AnimatePresence } from "framer-motion";
import { createContext, useCallback, useContext, useState, ReactNode } from "react";
import { Check, X, AlertCircle, Info } from "lucide-react";
type ToastType = "success" | "error" | "info";
interface Toast { id: string; type: ToastType; message: string; }
interface ToastContextType { showToast: (message: string, type?: ToastType) => void; confirm: (message: string) => Promise<boolean>; }
const ToastContext = createContext<ToastContextType>({ showToast: () => {}, confirm: async () => false });
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [confirmState, setConfirmState] = useState<{ message: string; resolve: (v: boolean) => void } | null>(null);
  const showToast = useCallback((message: string, type: ToastType = "success") => { const id = `toast-${Date.now()}-${Math.random()}`; setToasts((t) => [...t, { id, type, message }]); setTimeout(() => { setToasts((t) => t.filter((x) => x.id !== id)); }, 4000); }, []);
  const confirm = useCallback((message: string): Promise<boolean> => { return new Promise((resolve) => { setConfirmState({ message, resolve }); }); }, []);
  const handleConfirm = (value: boolean) => { if (confirmState) { confirmState.resolve(value); setConfirmState(null); } };
  return (
    <ToastContext.Provider value={{ showToast, confirm }}>
      {children}
      <div className="fixed top-4 right-4 z-[200] space-y-2 max-w-sm">
        <AnimatePresence>
          {toasts.map((t) => { const Icon = t.type === "success" ? Check : t.type === "error" ? AlertCircle : Info; const color = t.type === "success" ? "#10B981" : t.type === "error" ? "#EF4444" : "#06B6D4"; return (
            <motion.div key={t.id} initial={{ opacity: 0, x: 100, scale: 0.9 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: 100, scale: 0.9 }} className="rounded-xl p-4 flex items-start gap-3 max-w-sm" style={{ background: "rgba(14,42,58,0.95)", backdropFilter: "blur(20px)", borderLeft: `3px solid ${color}`, boxShadow: "0 8px 30px rgba(0,0,0,0.4)" }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${color}20` }}><Icon size={16} color={color} /></div>
              <p className="text-sm text-white flex-1 pt-1 whitespace-pre-line">{t.message}</p>
              <button onClick={() => setToasts((toasts) => toasts.filter((x) => x.id !== t.id))} className="text-sp-text2 hover:text-white"><X size={14} /></button>
            </motion.div>
          ); })}
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {confirmState && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => handleConfirm(false)} className="fixed inset-0 z-[300] flex items-center justify-center p-4" style={{ background: "rgba(6,21,32,0.85)", backdropFilter: "blur(8px)" }}>
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="rounded-2xl p-6 max-w-sm w-full" style={{ background: "rgba(14,42,58,0.95)", backdropFilter: "blur(20px)", boxShadow: "0 30px 80px rgba(0,0,0,0.6)" }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(239,68,68,0.15)" }}><AlertCircle size={24} className="text-red-400" /></div>
              <p className="text-center text-white font-medium mb-6">{confirmState.message}</p>
              <div className="flex gap-3">
                <button onClick={() => handleConfirm(false)} className="flex-1 py-2.5 rounded-xl text-sm font-medium text-sp-text2 hover:text-white" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>Cancelar</button>
                <button onClick={() => handleConfirm(true)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)" }}>Confirmar</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ToastContext.Provider>
  );
}
export const useToast = () => useContext(ToastContext);
