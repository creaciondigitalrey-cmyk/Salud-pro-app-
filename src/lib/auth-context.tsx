"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from "firebase/auth";
import { auth, isFirebaseConfigured } from "./firebase";
import { isSuperAdminEmail } from "./super-admin-config";
type AuthContextType = { user: User | null; loading: boolean; login: (email: string, password: string) => Promise<void>; logout: () => Promise<void>; isConfigured: boolean; isSuperAdmin: boolean; };
const AuthContext = createContext<AuthContextType>({ user: null, loading: true, login: async () => {}, logout: async () => {}, isConfigured: false, isSuperAdmin: false });
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(isFirebaseConfigured);
  useEffect(() => {
    if (!isFirebaseConfigured || !auth) { setLoading(false); return; }
    const unsub = onAuthStateChanged(auth, (u) => { setUser(u); setLoading(false); });
    const timeout = setTimeout(() => { setLoading(false); }, 2000);
    return () => { unsub(); clearTimeout(timeout); };
  }, []);
  const login = async (email: string, password: string) => { if (!auth) throw new Error("Firebase Auth no está configurado"); await signInWithEmailAndPassword(auth, email, password); };
  const logout = async () => { if (!auth) return; await signOut(auth); };
  const isSuperAdmin = isSuperAdminEmail(user?.email);
  return <AuthContext.Provider value={{ user, loading, login, logout, isConfigured: isFirebaseConfigured, isSuperAdmin }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
