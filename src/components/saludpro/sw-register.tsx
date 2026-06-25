"use client";
import { useEffect } from "react";

export function ServiceWorkerRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("[PWA] Service Worker registrado:", registration.scope);
        })
        .catch((err) => {
          console.log("[PWA] SW registration failed:", err);
        });
    }
  }, []);
  return null;
}
