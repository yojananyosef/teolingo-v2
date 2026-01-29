# TeoLingo v2 (Monolito Moderno) 1.2.3

Esta es la versión refactorizada de TeoLingo, consolidada en un único framework (**Next.js**) para maximizar la eficiencia en despliegues como Vercel y optimizar la experiencia de desarrollo.

## 🌟 Cambios Clave

- **Unificación de Stack:** NestJS ha sido remplazado completamente por Next.js usando **Server Actions** y **Route Handlers**.
- **Base de Datos Cloud:** Migración de SQLite local a **Turso (libSQL)** para persistencia real en la nube.
- **Metodología IME:** Implementación del paradigma de **Inmersión Multisensorial Estructurada** (Orton-Gillingham) para neurodivergencia.
- **Arquitectura Screaming:** Organización por funcionalidades (`features/`) dentro de la estructura de Next.js.
- **UI/UX Nativa:** Interfaz optimizada sin barras de scroll, con navegación móvil inteligente y sidebar colapsable.

## 🏗️ Estructura del Proyecto

```
apps/teolingo-v2/
 ├─ src/
 │   ├─ app/           # Capa de Edge (UI, Actions, Routes)
 │   ├─ features/      # Slices Verticales (Lógica de Negocio)
 │   │   ├─ lessons/
 │   │   └─ auth/
 │   ├─ infrastructure/# DB, Auth Lib, Clients
 │   └─ proxy.ts       # Gestión de sesiones
 └─ package.json
```

## 🚀 Configuración Local

1. Instala las dependencias:
   ```bash
   bun install
   ```
2. Prepara la base de datos local:

   ```bash
   bun run db:setup
   ```

   _Esto creará un archivo `local.db` y lo poblará con lecciones y usuarios de prueba._

3. Inicia el servidor de desarrollo:
   ```bash
   bun dev
   ```

## 🌐 Despliegue en Vercel (Producción)

1. Crea una base de datos en [Turso](https://turso.tech/).
2. Configura las variables de entorno en Vercel:
   - `TURSO_CONNECTION_URL`: URL de tu DB de Turso.
   - `TURSO_AUTH_TOKEN`: Token de autenticación de Turso.
   - `JWT_SECRET`: Una clave secreta para las sesiones.
3. El comando de build de Next.js se encargará del resto.

---

_Este proyecto sigue los estándares Senior Fullstack 2026._

## 🗺️ Roadmap & TODO (Equivalencia Hebreo 1 y 2 Universitario)

El objetivo final de TeoLingo es proporcionar una formación en hebreo bíblico equivalente a aprobar los cursos de Hebreo 1 y 2 en una facultad de teología universitaria.

### ✅ Completado

- [x] Arquitectura base con Next.js 16+ (App Router).
- [x] Sistema de autenticación JWT seguro.
- [x] Base de datos en la nube (Turso/libSQL).
- [x] **Módulo IME (Inmersión Multisensorial):** Sincronización de Alfabeto (27 letras), Paradigmas Rítmicos y Textos Ancla.
- [x] **Morfología Cromática:** Sistema VAKT de colores (Prefijo/Raíz/Sufijo) implementado en UI.
- [x] Sección de Aprendizaje (Lecciones progresivas).
- [x] Sección de Práctica Personalizada (Repaso inteligente).
- [x] Diccionario Bíblico (Vocabulario acumulado).
- [x] Sistema de puntos, niveles y rachas (Gamificación).
- [x] **UI Nativa:** Ocultación de scrollbars, navegación móvil con menú "Más" y Sidebar colapsable.

### 🛠️ Próximamente (Hebreo 1: Fundamentos)

- [x] **Módulo de Alef-Bet:** Ejercicios específicos de trazo y reconocimiento de letras (incluyendo formas Sofit).
- [ ] **Módulo de Niqqud:** Entrenamiento específico en sistemas vocálicos masoréticos.
- [ ] **Módulo de Sustantivos:** Género, número y el artículo definido.
- [ ] **Preposiciones e Interrogativos:** Uso de preposiciones inseparables y partículas de pregunta.
- [ ] **Adjetivos:** Concordancia y uso atributivo/predicativo.
- [ ] **Pronombres:** Personales, demostrativos y sufijos pronominales (Nivel básico).

### 📚 Futuro (Hebreo 2: Sintaxis y Verbos)

- [ ] **Sistema Verbal (Qal):** Perfecto e Imperfecto del tronco Qal.
- [ ] **Troncos Derivados:** Introducción a Niphal, Piel, Pual, Hiphil, Hophal e Hithpael.
- [ ] **Sintaxis Avanzada:** Constructos (Smikhut) y acentos masoréticos.
- [ ] **Traducción Exegética:** Herramientas para el análisis de textos originales del Tanaj.
- [ ] **Modo Erudito:** Desafíos de traducción sin ayuda de vocales.

---

_TeoLingo: De lo más simple a lo más teológico._
