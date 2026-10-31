<!--
Sync Impact Report
- Version change: unratified template -> 1.0.0
- Modified principles: template placeholders -> five project-specific principles
- Added sections: Product and security constraints; Development workflow and quality gates
- Removed sections: none
- Follow-up TODOs: none
-->
# Auditoría 360 Constitution

## Core Principles

### I. Especificación antes de implementación
Cada cambio funcional MUST comenzar con una especificación versionada que describa
valor para el usuario, escenarios de aceptación, límites y criterios de éxito.
La implementación no puede ampliar el alcance sin actualizar la especificación y
registrar la decisión.

### II. Contratos y adaptadores coherentes
La interfaz MUST consumir contratos de dominio estables y los modos demo y Supabase
MUST conservar comportamiento equivalente para las mismas operaciones permitidas.
Las diferencias inevitables de persistencia deben permanecer en adaptadores o
servicios, no duplicarse en páginas y componentes.

### III. Seguridad por capas
Los permisos MUST validarse en la interfaz para orientar al usuario y en el
repositorio o base de datos para impedir operaciones no autorizadas. Las reglas de
rol, aprobación, RLS, evidencias y bitácora MUST tratarse como requisitos de
seguridad verificables, no como detalles visuales.

### IV. Calidad verificable
Todo cambio MUST conservar lint, pruebas y compilación existentes. Las reglas de
negocio nuevas MUST tener pruebas automatizadas para el camino principal y los
rechazos relevantes. Los criterios de aceptación deben poder verificarse sin
depender de una inspección manual del código.

### V. Trazabilidad y simplicidad
Las operaciones que cambian datos relevantes MUST conservar actor, fecha, decisión
y contexto suficiente para auditoría. Se debe preferir la solución más pequeña que
cumpla la especificación, reutilizando patrones existentes y evitando abstracciones
o dependencias sin beneficio demostrable.

## Restricciones de producto y seguridad

El producto es una aplicación académica de auditoría tecnológica. React/Vite,
Tailwind, React Router, Vitest/Testing Library y Supabase son la base vigente y no
deben sustituirse como parte de una mejora ordinaria. El modo demo usa
`localStorage` e IndexedDB y no representa autenticación, cifrado, almacenamiento
centralizado ni auditoría inmutable de producción.

El modo Supabase MUST mantener autenticación, PostgreSQL, RLS, funciones de servidor,
históricos y bitácora. Ninguna clave `service_role` puede exponerse en variables
`VITE_*`. Las credenciales demo solo sirven para demostración local y no pueden
reutilizarse como configuración real. La marca y el lenguaje visual de referencia
no implican afiliación oficial con ninguna entidad financiera.

## Flujo de desarrollo y puertas de calidad

El flujo estándar es `constitution → specify → clarify → plan → tasks →
implement → validate`. Cada especificación debe separar requisitos funcionales,
escenarios, casos límite, supuestos y resultados medibles. Antes de integrar un
cambio se MUST ejecutar, como mínimo, `npm run lint`, `npm test` y `npm run build`,
salvo que el cambio sea exclusivamente documental y no afecte pruebas.

Los cambios de esquema, políticas RLS o contratos de repositorio requieren revisar
ambos modos de datos y actualizar la documentación relacionada. Los fallos deben
ser explícitos: no se permiten capturas amplias que oculten errores, valores por
defecto que simulen éxito ni omisiones silenciosas de permisos.

## Governance

Esta constitución es la referencia de gobierno para las especificaciones y cambios
del proyecto. Una enmienda MUST actualizar la versión semántica, la fecha, el
informe de impacto y la documentación o pruebas afectadas. Los cambios mayores
requieren una especificación nueva o actualizada y una revisión explícita de
compatibilidad con los modos demo y Supabase.

Cada revisión debe comprobar cumplimiento de los principios aplicables, criterios
de calidad y controles de seguridad. Si una excepción es necesaria, debe quedar
documentada en la especificación, explicar su alcance y definir una condición de
revisión posterior.

**Version**: 1.0.0 | **Ratified**: 2026-10-31 | **Last Amended**: 2026-10-31
