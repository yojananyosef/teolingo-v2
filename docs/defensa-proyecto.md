# Defensa del proyecto TeoLingo v2

## 1. Proposito

TeoLingo v2 es una plataforma de apoyo universitario para hebreo biblico (y extensible a griego koine), orientada a rigor exegtico con accesibilidad neurocognitiva.

No reemplaza la catedra: la complementa con practica guiada, retroalimentacion inmediata y trazabilidad de progreso.

## 2. Propuesta de valor

- Equilibrio entre rigor academico y accesibilidad.
- Aprendizaje activo basado en IME.
- Evaluacion orientada a comprension y transferencia.
- Analitica de progreso util para estudiante y docente.

## 3. Evidencia tecnica del producto

- Arquitectura consolidada en Next.js 16.
- Persistencia cloud con Turso/libSQL.
- Use cases por dominio (`lessons`, `auth`, `israeli-mode`).
- Practica por frecuencia biblica y modo sustantivos activo.
- Flashcards con repeticion espaciada.
- PWA con manifest y service worker.

## 4. Evidencia pedagogica integrada

El modelo combina:

- Diseno inverso (objetivos -> evidencia -> experiencias).
- Bloom (progresion LOTS a HOTS).
- IME multisensorial (VAKT, ritmo, morfologia cromatica).
- Evaluacion autentica (productos con sentido exegtico real).

## 5. Diferenciador frente a enfoques tradicionales

- Menos dependencia de memorizacion mecanica aislada.
- Mayor foco en analisis, evaluacion y criterio hermeneutico.
- Retroalimentacion continua y no solo examen final.
- Practica escalable 24/7.

## 6. Estado funcional actual

- Lecciones base y practica personalizable operativas.
- Modo frecuencia biblica por niveles.
- Modo sustantivos con clasificacion morfologica.
- Inmersion, anclas y flashcards funcionando.

## 7. Riesgos y mitigaciones

Riesgo: deuda de tipado y estandar de pruebas.
Mitigacion: roadmap con prioridad en tipado por modalidad y E2E.

Riesgo: dispersion documental historica.
Mitigacion: centralizacion completa en carpeta `docs/`.

## 8. Cierre

TeoLingo v2 ya demuestra viabilidad tecnica y valor pedagogico institucional.

El siguiente salto no es rehacer base, sino consolidar calidad operativa:

- pruebas,
- tipado,
- expansion curricular,
- instrumentos de evaluacion autentica.
