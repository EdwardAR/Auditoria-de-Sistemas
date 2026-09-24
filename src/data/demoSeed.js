export const demoUsers = [
  { id: '10000000-0000-0000-0000-000000000001', full_name: 'Valeria Mendoza', email: 'admin@demo.edu', password: 'Demo2026*', role: 'Administrador', last_sign_in_at: '2026-09-24T13:20:00Z' },
  { id: '10000000-0000-0000-0000-000000000002', full_name: 'Diego Salazar', email: 'auditor@demo.edu', password: 'Demo2026*', role: 'Auditor', last_sign_in_at: '2026-09-24T12:45:00Z' },
  { id: '10000000-0000-0000-0000-000000000003', full_name: 'Lucía Torres', email: 'supervisor@demo.edu', password: 'Demo2026*', role: 'Supervisor', last_sign_in_at: '2026-09-23T18:10:00Z' },
  { id: '10000000-0000-0000-0000-000000000004', full_name: 'Marco Ríos', email: 'consulta@demo.edu', password: 'Demo2026*', role: 'Consulta', last_sign_in_at: '2026-09-22T16:35:00Z' },
]

const audit = (id, title, owner, status, start, end, approval, description) => ({
  id, title, owner, status, start_date: start, end_date: end, approval_status: approval,
  description, observations: 'Ejecución alineada al plan anual de auditoría.',
  created_at: `${start}T14:00:00Z`, updated_at: `${start}T14:00:00Z`, created_by: demoUsers[1].id,
})

export const demoSeed = {
  profiles: demoUsers.map((user) => ({ id: user.id, full_name: user.full_name, email: user.email, role: user.role, created_at: '2026-01-10T12:00:00Z' })),
  audits: [
    audit('20000000-0000-0000-0000-000000000001', 'Auditoría de accesos privilegiados', 'Diego Salazar', 'En Proceso', '2026-08-01', '2026-10-15', 'Pendiente', 'Revisión de cuentas privilegiadas, segregación de funciones y recertificación.'),
    audit('20000000-0000-0000-0000-000000000002', 'Continuidad de servicios críticos', 'Ana Paredes', 'Completada', '2026-05-10', '2026-07-30', 'Aprobado', 'Evaluación de BCP, DRP y pruebas de recuperación de servicios bancarios.'),
    audit('20000000-0000-0000-0000-000000000003', 'Cumplimiento de gestión de cambios', 'Diego Salazar', 'Planificada', '2026-10-01', '2026-11-20', 'Pendiente', 'Validación del ciclo de cambios y despliegues a producción.'),
    audit('20000000-0000-0000-0000-000000000004', 'Seguridad de banca digital', 'Carla Medina', 'Cerrada', '2026-02-03', '2026-04-28', 'Aprobado', 'Evaluación de controles preventivos y monitoreo de canales digitales.'),
    audit('20000000-0000-0000-0000-000000000005', 'Proveedores tecnológicos críticos', 'Ana Paredes', 'En Proceso', '2026-07-15', '2026-09-30', 'Rechazado', 'Revisión de cláusulas, SLA, evidencias y riesgos de terceros.'),
    audit('20000000-0000-0000-0000-000000000006', 'Protección de datos personales', 'Carla Medina', 'Completada', '2026-04-01', '2026-06-12', 'Pendiente', 'Revisión de consentimiento, retención y tratamiento de datos.'),
  ],
  risks: [
    { id: '30000000-0000-0000-0000-000000000001', name: 'Acceso no autorizado a core bancario', category: 'Ciberseguridad', probability: 4, impact: 5, level: 'Crítico', status: 'En Tratamiento', approval_status: 'Pendiente', created_at: '2026-02-11T12:00:00Z', updated_at: '2026-09-01T12:00:00Z' },
    { id: '30000000-0000-0000-0000-000000000002', name: 'Indisponibilidad de banca móvil', category: 'Continuidad', probability: 3, impact: 5, level: 'Alto', status: 'En Tratamiento', approval_status: 'Aprobado', created_at: '2026-03-05T12:00:00Z', updated_at: '2026-08-20T12:00:00Z' },
    { id: '30000000-0000-0000-0000-000000000003', name: 'Fuga de datos por terceros', category: 'Proveedores', probability: 4, impact: 4, level: 'Alto', status: 'Identificado', approval_status: 'Pendiente', created_at: '2026-04-18T12:00:00Z', updated_at: '2026-09-10T12:00:00Z' },
    { id: '30000000-0000-0000-0000-000000000004', name: 'Cambios no autorizados en producción', category: 'Operaciones TI', probability: 2, impact: 4, level: 'Medio', status: 'Mitigado', approval_status: 'Aprobado', created_at: '2026-01-20T12:00:00Z', updated_at: '2026-07-12T12:00:00Z' },
    { id: '30000000-0000-0000-0000-000000000005', name: 'Pérdida de evidencias de auditoría', category: 'Cumplimiento', probability: 2, impact: 3, level: 'Medio', status: 'Aceptado', approval_status: 'Aprobado', created_at: '2026-05-22T12:00:00Z', updated_at: '2026-08-02T12:00:00Z' },
    { id: '30000000-0000-0000-0000-000000000006', name: 'Malware en estaciones administrativas', category: 'Ciberseguridad', probability: 3, impact: 3, level: 'Medio', status: 'En Tratamiento', approval_status: 'Pendiente', created_at: '2026-06-08T12:00:00Z', updated_at: '2026-09-15T12:00:00Z' },
    { id: '30000000-0000-0000-0000-000000000007', name: 'Desactualización de inventario CMDB', category: 'Gobierno TI', probability: 2, impact: 2, level: 'Bajo', status: 'Mitigado', approval_status: 'Aprobado', created_at: '2026-07-01T12:00:00Z', updated_at: '2026-09-03T12:00:00Z' },
  ],
  controls: [
    { id: '40000000-0000-0000-0000-000000000001', name: 'Recertificación trimestral de accesos', process: 'Gestión de identidades', responsible: 'Seguridad TI', compliance: 92, observations: 'Evidencias completas del último trimestre.', approval_status: 'Aprobado', created_at: '2026-01-12T12:00:00Z', updated_at: '2026-09-01T12:00:00Z' },
    { id: '40000000-0000-0000-0000-000000000002', name: 'Monitoreo de eventos SIEM', process: 'Ciberseguridad', responsible: 'SOC', compliance: 86, observations: 'Cobertura pendiente en dos fuentes legadas.', approval_status: 'Pendiente', created_at: '2026-02-04T12:00:00Z', updated_at: '2026-09-10T12:00:00Z' },
    { id: '40000000-0000-0000-0000-000000000003', name: 'Pruebas de recuperación', process: 'Continuidad', responsible: 'Infraestructura', compliance: 78, observations: 'Pendiente remediar tiempos RTO.', approval_status: 'Pendiente', created_at: '2026-02-25T12:00:00Z', updated_at: '2026-08-22T12:00:00Z' },
    { id: '40000000-0000-0000-0000-000000000004', name: 'Aprobación segregada de cambios', process: 'Gestión de cambios', responsible: 'Operaciones TI', compliance: 95, observations: 'Flujo automatizado y con evidencias.', approval_status: 'Aprobado', created_at: '2026-03-16T12:00:00Z', updated_at: '2026-09-11T12:00:00Z' },
    { id: '40000000-0000-0000-0000-000000000005', name: 'Evaluación anual de proveedores', process: 'Terceros', responsible: 'Riesgo operacional', compliance: 68, observations: 'Faltan evaluaciones de dos proveedores.', approval_status: 'Rechazado', created_at: '2026-04-03T12:00:00Z', updated_at: '2026-09-14T12:00:00Z' },
    { id: '40000000-0000-0000-0000-000000000006', name: 'Cifrado de respaldos', process: 'Protección de datos', responsible: 'Infraestructura', compliance: 100, observations: 'Control automatizado.', approval_status: 'Aprobado', created_at: '2026-05-07T12:00:00Z', updated_at: '2026-09-18T12:00:00Z' },
  ],
  security_incidents: [
    { id: '50000000-0000-0000-0000-000000000001', incident_type: 'Phishing dirigido', severity: 'Alta', incident_date: '2026-09-17', status: 'Contenido', description: 'Campaña detectada contra usuarios de operaciones.', approval_status: 'Pendiente', created_at: '2026-09-17T16:00:00Z', updated_at: '2026-09-18T10:00:00Z' },
    { id: '50000000-0000-0000-0000-000000000002', incident_type: 'Intento de acceso privilegiado', severity: 'Crítica', incident_date: '2026-08-29', status: 'Resuelto', description: 'Intentos bloqueados por controles de acceso adaptativo.', approval_status: 'Aprobado', created_at: '2026-08-29T08:00:00Z', updated_at: '2026-08-30T12:00:00Z' },
    { id: '50000000-0000-0000-0000-000000000003', incident_type: 'Malware', severity: 'Media', incident_date: '2026-07-14', status: 'Cerrado', description: 'Equipo aislado y remediado por EDR.', approval_status: 'Aprobado', created_at: '2026-07-14T11:00:00Z', updated_at: '2026-07-15T12:00:00Z' },
    { id: '50000000-0000-0000-0000-000000000004', incident_type: 'Pérdida de disponibilidad', severity: 'Alta', incident_date: '2026-06-09', status: 'Cerrado', description: 'Intermitencia de servicio durante 18 minutos.', approval_status: 'Aprobado', created_at: '2026-06-09T14:00:00Z', updated_at: '2026-06-11T12:00:00Z' },
    { id: '50000000-0000-0000-0000-000000000005', incident_type: 'Exposición de información', severity: 'Baja', incident_date: '2026-09-22', status: 'En Investigación', description: 'Documento interno compartido en canal incorrecto.', approval_status: 'Pendiente', created_at: '2026-09-22T18:00:00Z', updated_at: '2026-09-23T09:00:00Z' },
  ],
  control_assessments: [],
  risk_history: [],
  audit_events: [
    { id: 1, entity_type: 'audits', entity_id: '20000000-0000-0000-0000-000000000002', action: 'APPROVE', actor_name: 'Lucía Torres', actor_role: 'Supervisor', created_at: '2026-08-02T15:20:00Z', details: 'Auditoría aprobada con evidencias conformes.' },
    { id: 2, entity_type: 'risks', entity_id: '30000000-0000-0000-0000-000000000001', action: 'UPDATE', actor_name: 'Diego Salazar', actor_role: 'Auditor', created_at: '2026-09-01T10:30:00Z', details: 'Actualización de probabilidad e impacto.' },
  ],
  contacts: [],
}

const months = ['2026-04-01', '2026-05-01', '2026-06-01', '2026-07-01', '2026-08-01', '2026-09-01']
demoSeed.control_assessments = months.flatMap((month, monthIndex) => demoSeed.controls.map((control, index) => ({
  id: `ca-${monthIndex}-${index}`, control_id: control.id, assessment_month: month,
  compliance: Math.max(45, Math.min(100, control.compliance - (5 - monthIndex) * (2 + (index % 3)))),
})))

demoSeed.risk_history = months.map((month, index) => ({
  id: `rh-${index}`, risk_id: demoSeed.risks[index % demoSeed.risks.length].id, changed_at: `${month}T12:00:00Z`,
  probability: [5, 5, 4, 4, 3, 3][index], impact: [5, 5, 5, 4, 4, 4][index],
  level: ['Crítico', 'Crítico', 'Crítico', 'Alto', 'Alto', 'Alto'][index],
}))
