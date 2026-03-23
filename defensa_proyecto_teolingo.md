# TeoLingo v2.1.0 — Documento de Defensa del Proyecto

## 1. Resumen Ejecutivo

**TeoLingo** es una aplicación web progresiva (PWA) diseñada para la enseñanza del **hebreo bíblico** a nivel universitario. Combina principios de gamificación (inspirados en Duolingo) con la metodología **IME (Inmersión Multisensorial Estructurada)**, basada en el enfoque Orton-Gillingham, originalmente diseñado para personas con neurodivergencia pero beneficioso para todo tipo de aprendiz.

**Objetivo académico:** Proporcionar formación equivalente a los cursos de Hebreo 1 y Hebreo 2 de una facultad de teología, sirviendo como herramienta complementaria a la cátedra presencial.

---

## 2. Metodología IME (Inmersión Multisensorial Estructurada)

### Fundamento teórico
La metodología IME se basa en el enfoque **Orton-Gillingham**, un sistema probado de enseñanza de idiomas que utiliza múltiples canales sensoriales simultáneamente. El acrónimo **VAKT** resume los canales:

| Canal | Descripción | Implementación en TeoLingo |
|-------|-------------|---------------------------|
| **V**isual | Ver la letra/palabra | Morfología cromática (colores por prefijo/raíz/sufijo) |
| **A**uditivo | Escuchar la pronunciación | Sistema de audio con TTS y pronunciaciones pregrabadas |
| **K**inestésico | Interacción táctil | Selección de opciones, flashcards con gesto de revelación |
| **T**áctil | Asociación motora | Ejercicios de emparejamiento y secuenciación |

### Principios pedagógicos aplicados
1. **Progresión ladrillo a ladrillo** — Cada concepto se construye sobre el anterior. No se introduce vocabulario sin dominar primero el sistema de escritura.
2. **Repetición espaciada (SRS)** — Algoritmo SM-2 para flashcards que optimiza los intervalos de repaso según el desempeño del estudiante.
3. **Inmersión controlada** — El "Modo Israelí" expone al estudiante a hebreo puro sin traducción, pero en un entorno cerrado y seguro.
4. **Feedback inmediato** — Cada respuesta se evalúa al instante con retroalimentación visual y auditiva.
5. **Sin penalización destructiva** — Los errores son oportunidades de aprendizaje; el sistema muestra la respuesta correcta visualmente.

---

## 3. Módulos de la Aplicación

### 3.1 📖 Lecciones Progresivas (Sección "Aprender")
El núcleo de la app. 23 lecciones organizadas en 4 unidades con dificultad progresiva:

| Unidad | Nombre | Lecciones | Enfoque |
|--------|--------|-----------|---------|
| **0** | Cimientos del Hebreo | 5 | Sistema de escritura puro: 22 consonantes, vocales (Nikud), dagesh, signos de lectura, formas especiales (Sofit, guturales, matres lectionis, mappiq, pataj furtivo) |
| **1** | Fundamentos | 8 | Vocabulario bíblico básico: palabras frecuentes, verbos comunes, familia, santuario, animales, naturaleza |
| **2** | Vocabulario y Gramática | 5 | Adjetivos, verbos de movimiento, números 1-10, partes del cuerpo, tiempo y estaciones |
| **3** | Gramática Intermedia | 5 | Pronombres personales, preposiciones, ciudad/casa, verbos de comunicación, estado constructo (Smikhut) |

**Tipos de ejercicios:**
- `multiple-choice` — Selección múltiple con 4 opciones barajadas
- `translation` — Traducción de hebreo a español y viceversa

**Características UX:**
- Progresión visual tipo "camino" (inspirado en Duolingo)
- Bloqueo secuencial: no se puede avanzar sin completar la lección anterior
- Feedback visual al equivocarse: la respuesta incorrecta se pinta roja, la correcta pulsa en verde
- Barra de progreso durante cada lección
- Confetti y sonidos al completar

---

### 3.2 🧠 Inmersión Multisensorial (Sección "Inmersión")
Módulo basado en el marco VAKT que integra tres sub-sistemas:

#### a) Alfabeto Interactivo (27 caracteres)
- Tabla completa del alef-bet incluyendo formas finales (Sofit)
- Cada letra muestra: nombre, transliteración, valor numérico y pronunciación con audio

#### b) Paradigmas Rítmicos
- Patrones de pronunciación con ritmo para memorización muscular
- Combina canal auditivo + kinestésico

#### c) Textos Ancla
- Versículos bíblicos clave (ej: Génesis 1:1) con **morfología cromática**
- Cada palabra se descompone en: prefijo (azul), raíz (naranja), sufijo (verde)
- El estudiante ve la estructura interna de las palabras hebreas

---

### 3.3 🗂️ Flashcards con Repetición Espaciada (SRS)
Sistema de repaso basado en el **algoritmo SM-2** (SuperMemo 2):

**Flujo VAKT:**
1. **Acción** — Se presenta la palabra hebrea, el estudiante intenta recordarla
2. **Revelación** — Se muestra la traducción y morfología
3. **Calificación** — El estudiante evalúa su nivel de recuerdo (1-5)

**El algoritmo ajusta:**
- `easeFactor` — Factor de facilidad de cada tarjeta
- `interval` — Días hasta el próximo repaso
- `repetitions` — Contador de repasos exitosos

Las tarjetas difíciles aparecen más frecuentemente; las dominadas se espacian progresivamente.

---

### 3.4 🇮🇱 Modo Israelí (Inmersión Léxica Cerrada — ILC)
Módulo avanzado con 3 fases de inmersión progresiva:

| Fase | Nombre | Descripción |
|------|--------|-------------|
| 1 | **Multisensorial** | Exposición a la palabra con audio, imagen y contexto. Sin presión. |
| 2 | **Mundo Cerrado** | Ejercicios donde TODAS las opciones son en hebreo. Sin español. |
| 3 | **Traducción Guiada** | Ahora sí se introduce la traducción, pero el estudiante ya "conoce" la palabra. |

**Objetivo:** Automatizar el reconocimiento del lenguaje sin el estrés de la traducción prematura.

### 3.5 📈 Práctica por Frecuencia Bíblica
Módulo diseñado para maximizar el rendimiento del estudio del vocabulario bíblico, basado en su frecuencia de aparición en el Tanaj.
- Reemplaza enfoques de repaso aleatorio genérico, permitiendo a los estudiantes enfocarse en:
  - **Nivel 1:** Top 25 palabras (aparecen 2200-5000 veces)
  - **Nivel 2:** Próximas 27 palabras (aparecen 1000-2199 veces)
- Generación de sesiones dinámicas de traducción pura.

---

### 3.6 📊 Gamificación y Progreso
Sistema completo de motivación:

| Elemento | Descripción |
|----------|-------------|
| **Puntos XP** | Se ganan al completar lecciones (proporcional a la precisión) |
| **Niveles** | Progresión numérica basada en XP acumulados |
| **Rachas** | Días consecutivos de estudio |
| **Logros** | Badges desbloqueables por hitos específicos |
| **Feedback Visual** | Botones de colores con animaciones interactivas para reforzar el acierto/error visualmente. |
| **Precisión** | Porcentaje de respuestas correctas por lección |
| **Tabla de líderes** | Ranking entre estudiantes |

---

## 4. Stack Tecnológico

| Componente | Tecnología |
|-----------|-----------|
| Framework | Next.js 16+ (App Router, Server Components) |
| Runtime | Bun (alternativa rápida a Node.js) |
| Base de datos | Turso (libSQL) — nube con réplicas edge |
| ORM | Drizzle ORM (type-safe) |
| Autenticación | JWT con sesiones seguras |
| Despliegue | Vercel (CDN global, edge functions) |
| Audio | TTS nativo + fallback a API proxy |
| UI | React + Tailwind CSS + Lucide Icons |

**Arquitectura:** Screaming Architecture — organización por funcionalidades (`features/lessons`, `features/auth`, `features/israeli-mode`) en lugar de por capas técnicas.

---

## 5. Diferenciadores Pedagógicos

### vs. Duolingo
| Aspecto | Duolingo | TeoLingo |
|---------|----------|----------|
| Idioma objetivo | Hebreo moderno | **Hebreo bíblico** |
| Metodología | Gamificación pura | **IME + Gamificación** |
| Contexto | Frases cotidianas | **Textos bíblicos reales** |
| Morfología | No visible | **Cromática (prefijo/raíz/sufijo)** |
| Repetición espaciada | Limitada | **SM-2 completo** |
| Inmersión | General | **ILC controlada en 3 fases** |

### vs. Clase presencial sola
- **Disponibilidad 24/7** — El estudiante practica cuando quiere
- **Feedback instantáneo** — No hay que esperar a la siguiente clase para saber si acertó
- **Progresión personalizada** — El SRS adapta el contenido al ritmo individual
- **Consolidación** — Lo visto en clase se refuerza con ejercicios interactivos

---

## 6. Validación Inicial

- ✅ Probado con un estudiante de primer año que reportó: *"me sirvió mucho y aprendí, consolidé lo visto en clase"*
- ✅ La Unidad 0 (5 lecciones) cubre el sistema de escritura completo antes de introducir vocabulario, eliminando el salto cognitivo identificado
- ✅ 23 lecciones con 200+ ejercicios implementados
- ✅ Aplicación desplegada y funcional en producción (Vercel)

---

## 7. Roadmap Futuro

### Corto plazo (Hebreo 1)
- Preposiciones inseparables (בּ, כּ, ל) y la preposición מן
- Conjunción Waw y sus reglas vocálicas
- Partícula interrogativa ה
- Demostrativos (זה, זאת, אלה)
- Pronombres personales separados y sufijos

### Mediano plazo (Hebreo 2)
- Sistema verbal Qal (Perfecto e Imperfecto)
- Troncos derivados (Niphal, Piel, Hiphil, etc.)
- Construcciones Smikhut y acentos masoréticos
- Modo Erudito: traducción sin vocales

---

*TeoLingo v2.1.0 — De lo más simple a lo más teológico.*
