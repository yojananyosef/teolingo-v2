# TeoLingo v2.1.0

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

## 📚 Currículo de Lecciones

El aprendizaje sigue una progresión pedagógica alineada con la metodología IME (ladrillo a ladrillo):

| Unidad | Nombre | Lecciones | Enfoque |
|--------|--------|-----------|----------|
| **0** | Cimientos del Hebreo | 5 (order 1-5) | Sistema de escritura: consonantes, vocales, dagesh, signos de lectura, formas especiales (Sofit, guturales, matres lectionis) |
| **1** | Fundamentos y Alef-Bet | 8 (order 6-13) | Vocabulario básico: palabras, verbos, familia, santuario, animales, naturaleza |
| **2** | Vocabulario y Gramática | 5 (order 14-18) | Adjetivos, verbos de movimiento, números, partes del cuerpo, tiempo |
| **3** | Gramática Intermedia | 5 (order 19-23) | Pronombres, preposiciones, ciudad/casa, verbos de comunicación, estado constructo |

> La Unidad 0 fue diseñada para eliminar el salto cognitivo de ir directamente a traducción de vocabulario sin dominar previamente el sistema de escritura hebreo.

## 🗺️ Roadmap & TODO (Equivalencia Hebreo 1 y 2 Universitario)

El objetivo final de TeoLingo es proporcionar una formación en hebreo bíblico equivalente a aprobar los cursos de Hebreo 1 y 2 en una facultad de teología universitaria.

### ✅ Completado

- [x] Arquitectura base con Next.js 16+ (App Router).
- [x] Sistema de autenticación JWT seguro.
- [x] Base de datos en la nube (Turso/libSQL).
- [x] **Módulo IME (Inmersión Multisensorial):** Sincronización de Alfabeto (27 letras), Paradigmas Rítmicos y Textos Ancla.
- [x] **Flashcards IME (SRS):** Sistema de repaso espaciado (SM-2) con flujo VAKT (Acción -> Revelación -> Calificación).
- [x] **Sistema de Audio Robusto:** Reproducción con fallback (Pre-grabado -> TTS Nativo -> Proxy API) para máxima compatibilidad y bypass de bloqueos de navegador.
- [x] **Morfología Cromática:** Sistema VAKT de colores (Prefijo/Raíz/Sufijo) implementado en UI mediante emparejamiento de sub-cadenas.
- [x] Sección de Aprendizaje (Lecciones progresivas).
- [x] Sección de Práctica Personalizada (Frecuencia Bíblica y Repaso Inteligente).
- [x] Diccionario Bíblico (Vocabulario acumulado).
- [x] Sistema de puntos, niveles y rachas (Gamificación).
- [x] **UI Nativa y Feedback Visual:** Ocultación de scrollbars, navegación móvil con menú "Más", Sidebar colapsable, diseño de tarjetas auto-ajustables y animaciones de feedback visual interactivo.
- [x] **Hito Técnico (Commit `5db33dc9`):** Implementación integral del sistema de Flashcards IME con persistencia en DB y lógica de repetición espaciada.
- [x] **Modo Israelí (ILC):** Sistema de Inmersión Léxica Cerrada con flujo de 3 fases (Multisensorial, Mundo Cerrado y Traducción Guiada) para automatización del lenguaje sin estrés ortográfico.
- [x] **Unidad 0 — Cimientos del Hebreo:** Nivel introductorio con 5 lecciones pre-vocabulario (Alef-Bet, Nikud/Semivocales, Dagesh Kal/Jazaq, Maqef, formas especiales y guturales).

### 🛠️ Próximamente (Hebreo 1: Fundamentos)

- [x] **Módulo de Alef-Bet:** Ejercicios específicos de trazo y reconocimiento de letras (incluyendo formas Sofit).
- [x] **Módulo de Sustantivos (Modo Israelí):** Género, número y el artículo definido mediante inmersión controlada.
- [x] **Módulo de Niqqud:** Entrenamiento específico en sistemas vocálicos masoréticos (cubierto en Unidad 0, Lección 0-2).
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
