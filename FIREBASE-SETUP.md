# Reglas de Seguridad Firebase — SaludPro

Copia y pega estas reglas en la consola de Firebase para que la plataforma funcione correctamente.

## 1. Firestore Rules

Ve a **Firestore Database → Rules** y pega:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // /profesionales — portafolios públicos
    // Cualquiera puede leer (para ver los portafolios /c/[slug])
    // Solo autenticados pueden escribir
    match /profesionales/{profesionalId} {
      allow read: if true;
      allow create, update, delete: if request.auth != null;
    }

    // /solicitudes — solicitudes de registro
    // Cualquiera puede crear (formulario público)
    // Solo autenticados pueden leer/modificar
    match /solicitudes/{solicitudId} {
      allow read: if request.auth != null;
      allow create: if true;
      allow update, delete: if request.auth != null;
    }

    // /config — configuración global (tasa BCV, etc.)
    // Solo autenticados pueden leer/escribir
    match /config/{documentId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }

    // /ia_usage — registro de uso de IA (analytics)
    // Solo lectura para autenticados, escritura solo desde server (Admin SDK)
    match /ia_usage/{usageId} {
      allow read: if request.auth != null;
      allow write: if false;
    }

    // Bloquear todo lo demás por defecto
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## 2. Por qué estas reglas

- **`/profesionales`** es público en lectura porque los portafolios deben verse sin login (cualquier persona que visite `/c/maria-gonzalez` debe poder verlo)
- **`/solicitudes`** permite crear sin login porque el formulario público de registro necesita escribir ahí
- **`/config`** (incluye tasa BCV) requiere autenticación para evitar que cualquiera cambie la tasa
- **`/ia_usage`** solo se escribe desde el servidor con Admin SDK (no desde el cliente)
- Todo lo demás está bloqueado por defecto (seguridad)

## 3. Cómo publicar las reglas

1. Ve a https://console.firebase.google.com
2. Selecciona el proyecto `saludpro-31e9a`
3. Menú izquierdo → **Firestore Database** → pestaña **Rules**
4. Pega las reglas de arriba
5. Click en **Publish**

## 4. Verificar que funciona

Después de publicar las reglas:
- Visita cualquier `/c/[slug]` → debe cargar el portafolio sin login ✅
- Inicia sesión como super admin → ve a Configuración → actualiza la tasa BCV → debe guardar ✅
- Sin login, intenta editar un profesional → debe fallar ✅
