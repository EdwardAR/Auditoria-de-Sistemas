# Auditoría 360 — Sistema de Auditoría Tecnológica

Aplicación web académica para gestionar auditorías, riesgos tecnológicos, controles internos, incidentes de seguridad y métricas de cumplimiento. La experiencia visual toma como referencia el lenguaje corporativo de Scotiabank Perú, pero **no es un producto oficial ni mantiene afiliación con la entidad**.

## Capacidades principales

- Autenticación y sesiones persistentes con Supabase Auth.
- Cuatro perfiles: Administrador, Auditor, Supervisor y Consulta.
- CRUD completo con búsqueda, filtros, paginación, validación y vistas responsive.
- Flujo formal de aprobación con decisión, observación, aprobador y fecha.
- Matriz automática de riesgos 5×5 y cumplimiento de controles de 0 a 100%.
- Dashboard ejecutivo y seis gráficos analíticos construidos con datos reales.
- Históricos mensuales de controles y evolución de riesgos.
- Bitácora inmutable de operaciones generada por triggers de PostgreSQL.
- Formulario público de contacto sin permiso de lectura pública.
- Modo demo sin red, con persistencia en `localStorage`.

## Arquitectura

```text
Navegador React
 ├─ AuthContext             sesión, rol y perfil
 ├─ DataContext             repositorio activo y sincronización
 ├─ DemoRepository          localStorage + datos precargados
 └─ SupabaseRepository      Auth/PostgREST/RPC + RLS
                              │
                              └─ PostgreSQL
                                 ├─ políticas RLS
                                 ├─ RPC de aprobación/contacto
                                 └─ triggers de históricos y bitácora
```

La UI consume un único contrato de repositorio. Cambiar entre demo y Supabase no requiere modificar páginas ni componentes.

## Tecnologías

- React 18 y Vite
- Tailwind CSS y Framer Motion
- React Router DOM
- Recharts
- Axios
- Lucide React
- Supabase Auth, PostgreSQL y Row Level Security
- Vitest y Testing Library

## Estructura

```text
src/
├── components/     componentes reutilizables, formularios, tablas y gráficos
├── context/        autenticación, datos y notificaciones
├── data/           configuración de entidades y dataset demo
├── hooks/          acceso a contexto y operaciones CRUD
├── layouts/        shell corporativo y navegación responsive
├── pages/          módulos funcionales y páginas públicas
├── services/       adaptadores Demo/Supabase y cliente de datos
├── test/           configuración de pruebas
├── utils/          permisos, cálculos, analítica y formatos
├── App.jsx
└── main.jsx
supabase/
├── schema.sql      tablas, funciones, triggers, privilegios y RLS
└── seed.sql        datos académicos de prueba
```

## Instalación y ejecución

Requisitos: Node.js 20 o superior y npm.

```bash
npm install
copy .env.example .env
npm run dev
```

Abrir `http://localhost:5173`. La configuración inicial usa el modo demo.

Comandos disponibles:

```bash
npm run dev       # desarrollo
npm run build     # compilación de producción
npm run preview   # vista previa de dist/
npm run lint      # análisis estático
npm test          # pruebas automatizadas
```

## Modo demo

En `.env`:

```env
VITE_DATA_MODE=demo
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

La pantalla de acceso ofrece botones rápidos. También se puede ingresar manualmente con estas cuentas y la contraseña común `Demo2026*`:

| Rol | Correo |
|---|---|
| Administrador | `admin@demo.edu` |
| Auditor | `auditor@demo.edu` |
| Supervisor | `supervisor@demo.edu` |
| Consulta | `consulta@demo.edu` |

Los cambios persisten en el navegador. Para restaurar el dataset, eliminar las claves `audit360_demo_database_v1` y `audit360_demo_session_v1` del almacenamiento local.

> Las credenciales demo solo existen en el adaptador local y nunca deben reutilizarse en un ambiente real.

## Configuración de Supabase

### Conexión MCP desde VS Code

El MCP permite que Codex inspeccione y administre el proyecto de Supabase desde una sesión de desarrollo. La configuración debe permanecer limitada al proyecto `lswmqqzhcgdwcfkvbkal`.

Desde la terminal integrada de VS Code, ejecutar:

```powershell
codex mcp add supabase --url "https://mcp.supabase.com/mcp?project_ref=lswmqqzhcgdwcfkvbkal&features=docs%2Caccount%2Cdatabase%2Cdebugging%2Cdevelopment%2Cfunctions%2Cbranching"
codex mcp login supabase
codex mcp list
```

Si el cliente Codex devuelve un error indicando que `docs`, `database` u otra feature no es un OAuth scope válido, autenticar con los scopes equivalentes:

```powershell
codex mcp login supabase --scopes "projects:read,projects:write,database:read,database:write,analytics:read,edge_functions:read,edge_functions:write"
```

Tras autenticar, usar **Developer: Reload Window** (`Ctrl + Shift + P`) y abrir una conversación nueva en el panel de Codex. Verificar con este mensaje:

```text
Usa el MCP de Supabase y lista las tablas del proyecto lswmqqzhcgdwcfkvbkal. No modifiques nada.
```

El MCP no sustituye las variables de entorno del frontend. Tampoco debe usarse una clave `service_role` en archivos `VITE_*`. El flujo recomendado es:

1. Inspeccionar tablas y migraciones sin escribir.
2. Aplicar `schema.sql` únicamente después de revisar conflictos.
3. Crear usuarios en **Authentication > Users**.
4. Ejecutar `seed.sql` para asignar roles y cargar datos demo.
5. Configurar `.env` y probar login, CRUD y RLS desde la aplicación.

La instalación opcional de instrucciones especializadas para agentes es:

```powershell
npx skills add supabase/agent-skills
```

1. Crear un proyecto en Supabase.
2. Abrir **SQL Editor** y ejecutar [`supabase/schema.sql`](supabase/schema.sql).
3. En **Authentication → Providers**, habilitar Email/Password.
4. Crear cuatro usuarios con los correos de la tabla anterior. Definir contraseñas propias y seguras.
5. Ejecutar [`supabase/seed.sql`](supabase/seed.sql). El script asocia esos usuarios a sus roles y carga datos funcionales.
6. Obtener Project URL y `anon` public key desde **Project Settings → API**.
7. Configurar `.env`:

```env
VITE_DATA_MODE=supabase
VITE_SUPABASE_URL=https://lswmqqzhcgdwcfkvbkal.supabase.co
VITE_SUPABASE_ANON_KEY=TU_CLAVE_ANON_PUBLICA
```

8. Reiniciar `npm run dev`.

No se debe colocar una `service_role` key en variables `VITE_*`: Vite las expone al navegador.

### Creación de usuarios adicionales

El trigger `handle_new_user` crea automáticamente un perfil con rol `Consulta`. Un administrador de Supabase puede cambiarlo de forma controlada:

```sql
update public.profiles
set role = 'Auditor'
where email = 'nuevo.auditor@organizacion.pe';
```

No existe registro público ni edición de roles desde el cliente.

## Seguridad y RLS

| Operación | Administrador | Auditor | Supervisor | Consulta |
|---|:---:|:---:|:---:|:---:|
| Leer registros operativos | Sí | Sí | Sí | Sí |
| Crear y editar | Sí | Sí | No | No |
| Eliminar | Sí | No | No | No |
| Aprobar o rechazar | Sí | No | Sí | No |
| Consultar bitácora | Sí | No | Sí | No |
| Leer contactos | Sí | No | No | No |

RLS limita las filas y los privilegios PostgreSQL limitan columnas. Auditor y Administrador pueden editar únicamente campos funcionales; los campos de aprobación solo se modifican mediante `review_record`, una RPC que vuelve a comprobar el rol. Editar un registro aprobado restablece la decisión a `Pendiente`.

La bitácora y los históricos no aceptan escritura directa desde clientes autenticados. Se generan mediante funciones de servidor. El formulario público llama a `submit_contact`; el rol anónimo no tiene `SELECT` sobre `contacts`.

### Verificación recomendada de RLS

Probar cada caso desde cuatro sesiones independientes o con usuarios temporales:

1. Consulta intenta insertar y actualizar: debe recibir `42501`.
2. Auditor crea y edita: debe funcionar; eliminar o ejecutar `review_record` debe fallar.
3. Supervisor puede leer y aprobar mediante RPC, pero no editar campos funcionales.
4. Administrador puede ejecutar CRUD y aprobación.
5. Usuario anónimo envía `submit_contact`, pero un `SELECT contacts` debe fallar.
6. Cualquier escritura directa en `audit_events`, `risk_history` o `control_assessments` debe fallar.
7. Intentar actualizar `profiles.role` desde el navegador debe fallar.

## Matriz de riesgo

El nivel se calcula tanto en frontend como mediante trigger de PostgreSQL:

| Puntaje (probabilidad × impacto) | Nivel |
|---:|---|
| 1–4 | Bajo |
| 5–9 | Medio |
| 10–16 | Alto |
| 17–25 | Crítico |

La base de datos recalcula el valor para impedir inconsistencias originadas por clientes manipulados.

## Capturas sugeridas para la presentación

1. Login corporativo y selector de perfiles demo.
2. Dashboard ejecutivo en escritorio.
3. Gestión de riesgos mostrando la matriz automática.
4. Flujo de aprobación desde el rol Supervisor.
5. Dashboard analítico con las seis visualizaciones.
6. Bitácora inmutable y página de Seguridad de la Información.
7. Navegación móvil.
8. Políticas RLS visibles en Supabase Dashboard.

## Buenas prácticas para un despliegue real

- Activar MFA, CAPTCHA, protección contra contraseñas filtradas y políticas de sesión en Supabase Auth.
- Colocar el formulario público detrás de una Edge Function con rate limiting o un WAF. El honeypot incluido reduce bots básicos, pero no sustituye protección de red.
- Usar dominios autorizados y cabeceras CSP, HSTS, `X-Content-Type-Options` y `Referrer-Policy` desde el hosting.
- Separar proyectos Supabase de desarrollo, pruebas y producción.
- Integrar los logs con un SIEM y configurar alertas sobre accesos privilegiados.
- Revisar periódicamente roles, políticas RLS, dependencias y evidencias de restauración.
- Aplicar respaldo, retención y borrado de contactos conforme a la normativa de privacidad aplicable.

## Pruebas

La suite valida la matriz 5×5, los cálculos analíticos y permisos esenciales del repositorio demo. Antes de una entrega:

```bash
npm run lint
npm test
npm run build
```

## Conclusión

Auditoría 360 ofrece una base académica completa y demostrable para gobierno, riesgo y cumplimiento tecnológico. Combina una experiencia ejecutiva, controles de acceso verificables, trazabilidad y separación limpia entre presentación y persistencia, permitiendo evolucionar el proyecto sin reemplazar la interfaz.
