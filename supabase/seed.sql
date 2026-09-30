-- Datos de demostración para Auditoría 360
-- Antes de ejecutar, crear en Authentication > Users las cuentas:
-- admin@demo.edu, auditor@demo.edu, supervisor@demo.edu y consulta@demo.edu

update public.profiles set full_name='Valeria Mendoza', role='Administrador' where email='admin@demo.edu';
update public.profiles set full_name='Diego Salazar', role='Auditor' where email='auditor@demo.edu';
update public.profiles set full_name='Lucía Torres', role='Supervisor' where email='supervisor@demo.edu';
update public.profiles set full_name='Marco Ríos', role='Consulta' where email='consulta@demo.edu';

insert into public.audits (id,title,description,owner,status,start_date,end_date,observations,approval_status,created_by,updated_by)
values
('20000000-0000-0000-0000-000000000001','Auditoría de accesos privilegiados','Revisión de cuentas privilegiadas, segregación de funciones y recertificación.','Diego Salazar','En Proceso','2026-08-01','2026-10-15','Ejecución alineada al plan anual.','Pendiente',(select id from public.profiles where email='auditor@demo.edu'),(select id from public.profiles where email='auditor@demo.edu')),
('20000000-0000-0000-0000-000000000002','Continuidad de servicios críticos','Evaluación de BCP, DRP y pruebas de recuperación.','Ana Paredes','Completada','2026-05-10','2026-07-30','Pruebas ejecutadas satisfactoriamente.','Aprobado',(select id from public.profiles where email='auditor@demo.edu'),(select id from public.profiles where email='auditor@demo.edu')),
('20000000-0000-0000-0000-000000000003','Cumplimiento de gestión de cambios','Validación del ciclo de cambios y despliegues a producción.','Diego Salazar','Planificada','2026-10-01','2026-11-20','Incluida en el cuarto trimestre.','Pendiente',(select id from public.profiles where email='auditor@demo.edu'),(select id from public.profiles where email='auditor@demo.edu')),
('20000000-0000-0000-0000-000000000004','Seguridad de banca digital','Evaluación de controles preventivos y monitoreo de canales digitales.','Carla Medina','Cerrada','2026-02-03','2026-04-28','Informe final emitido.','Aprobado',(select id from public.profiles where email='auditor@demo.edu'),(select id from public.profiles where email='auditor@demo.edu'))
on conflict (id) do nothing;

insert into public.risks (id,name,category,probability,impact,level,status,approval_status,created_by,updated_by)
values
('30000000-0000-0000-0000-000000000001','Acceso no autorizado a core bancario','Ciberseguridad',4,5,'Crítico','En Tratamiento','Pendiente',(select id from public.profiles where email='auditor@demo.edu'),(select id from public.profiles where email='auditor@demo.edu')),
('30000000-0000-0000-0000-000000000002','Indisponibilidad de banca móvil','Continuidad',3,5,'Alto','En Tratamiento','Aprobado',(select id from public.profiles where email='auditor@demo.edu'),(select id from public.profiles where email='auditor@demo.edu')),
('30000000-0000-0000-0000-000000000003','Fuga de datos por terceros','Proveedores',4,4,'Alto','Identificado','Pendiente',(select id from public.profiles where email='auditor@demo.edu'),(select id from public.profiles where email='auditor@demo.edu')),
('30000000-0000-0000-0000-000000000004','Cambios no autorizados en producción','Operaciones TI',2,4,'Medio','Mitigado','Aprobado',(select id from public.profiles where email='auditor@demo.edu'),(select id from public.profiles where email='auditor@demo.edu')),
('30000000-0000-0000-0000-000000000005','Pérdida de evidencias de auditoría','Cumplimiento',2,3,'Medio','Aceptado','Aprobado',(select id from public.profiles where email='auditor@demo.edu'),(select id from public.profiles where email='auditor@demo.edu')),
('30000000-0000-0000-0000-000000000006','Malware en estaciones administrativas','Ciberseguridad',3,3,'Medio','En Tratamiento','Pendiente',(select id from public.profiles where email='auditor@demo.edu'),(select id from public.profiles where email='auditor@demo.edu')),
('30000000-0000-0000-0000-000000000007','Desactualización de inventario CMDB','Gobierno TI',2,2,'Bajo','Mitigado','Aprobado',(select id from public.profiles where email='auditor@demo.edu'),(select id from public.profiles where email='auditor@demo.edu'))
on conflict (id) do nothing;

insert into public.controls (id,name,process,responsible,compliance,observations,approval_status,created_by,updated_by)
values
('40000000-0000-0000-0000-000000000001','Recertificación trimestral de accesos','Gestión de identidades','Seguridad TI',92,'Evidencias completas del último trimestre.','Aprobado',(select id from public.profiles where email='auditor@demo.edu'),(select id from public.profiles where email='auditor@demo.edu')),
('40000000-0000-0000-0000-000000000002','Monitoreo de eventos SIEM','Ciberseguridad','SOC',86,'Cobertura pendiente en dos fuentes legadas.','Pendiente',(select id from public.profiles where email='auditor@demo.edu'),(select id from public.profiles where email='auditor@demo.edu')),
('40000000-0000-0000-0000-000000000003','Pruebas de recuperación','Continuidad','Infraestructura',78,'Pendiente remediar tiempos RTO.','Pendiente',(select id from public.profiles where email='auditor@demo.edu'),(select id from public.profiles where email='auditor@demo.edu')),
('40000000-0000-0000-0000-000000000004','Aprobación segregada de cambios','Gestión de cambios','Operaciones TI',95,'Flujo automatizado y con evidencias.','Aprobado',(select id from public.profiles where email='auditor@demo.edu'),(select id from public.profiles where email='auditor@demo.edu')),
('40000000-0000-0000-0000-000000000005','Evaluación anual de proveedores','Terceros','Riesgo operacional',68,'Faltan evaluaciones de dos proveedores.','Rechazado',(select id from public.profiles where email='auditor@demo.edu'),(select id from public.profiles where email='auditor@demo.edu')),
('40000000-0000-0000-0000-000000000006','Cifrado de respaldos','Protección de datos','Infraestructura',100,'Control automatizado.','Aprobado',(select id from public.profiles where email='auditor@demo.edu'),(select id from public.profiles where email='auditor@demo.edu'))
on conflict (id) do nothing;

insert into public.security_incidents (id,incident_type,severity,description,incident_date,status,approval_status,created_by,updated_by)
values
('50000000-0000-0000-0000-000000000001','Phishing dirigido','Alta','Campaña detectada contra usuarios de operaciones.','2026-09-17','Contenido','Pendiente',(select id from public.profiles where email='auditor@demo.edu'),(select id from public.profiles where email='auditor@demo.edu')),
('50000000-0000-0000-0000-000000000002','Intento de acceso privilegiado','Crítica','Intentos bloqueados por controles de acceso adaptativo.','2026-08-29','Resuelto','Aprobado',(select id from public.profiles where email='auditor@demo.edu'),(select id from public.profiles where email='auditor@demo.edu')),
('50000000-0000-0000-0000-000000000003','Malware','Media','Equipo aislado y remediado por EDR.','2026-07-14','Cerrado','Aprobado',(select id from public.profiles where email='auditor@demo.edu'),(select id from public.profiles where email='auditor@demo.edu')),
('50000000-0000-0000-0000-000000000004','Pérdida de disponibilidad','Alta','Intermitencia de servicio durante 18 minutos.','2026-06-09','Cerrado','Aprobado',(select id from public.profiles where email='auditor@demo.edu'),(select id from public.profiles where email='auditor@demo.edu')),
('50000000-0000-0000-0000-000000000005','Exposición de información','Baja','Documento interno compartido en canal incorrecto.','2026-09-22','En Investigación','Pendiente',(select id from public.profiles where email='auditor@demo.edu'),(select id from public.profiles where email='auditor@demo.edu'))
on conflict (id) do nothing;

insert into public.control_assessments (control_id, assessment_month, compliance)
select c.id, m.month, greatest(45, least(100, c.compliance - m.delta))
from public.controls c
cross join (values ('2026-04-01'::date,10),('2026-05-01'::date,8),('2026-06-01'::date,6),('2026-07-01'::date,4),('2026-08-01'::date,2)) as m(month,delta)
on conflict (control_id, assessment_month) do nothing;

insert into public.risk_history (risk_id, probability, impact, level, changed_at)
values
('30000000-0000-0000-0000-000000000001',5,5,'Crítico','2026-04-05'),
('30000000-0000-0000-0000-000000000001',5,5,'Crítico','2026-05-05'),
('30000000-0000-0000-0000-000000000003',4,5,'Crítico','2026-06-05'),
('30000000-0000-0000-0000-000000000002',4,4,'Alto','2026-07-05'),
('30000000-0000-0000-0000-000000000002',3,4,'Alto','2026-08-05'),
('30000000-0000-0000-0000-000000000006',3,3,'Medio','2026-09-05');

insert into public.findings (id,title,audit_title,severity,status,owner,due_date,description,recommendation,approval_status,created_by,updated_by)
values
('60000000-0000-0000-0000-000000000001','RecertificaciÃ³n de cuentas privilegiadas incompleta','AuditorÃ­a de accesos privilegiados','Alta','En remediaciÃ³n','Seguridad TI','2026-10-10','Dos cuentas administrativas no cuentan con evidencia de recertificaciÃ³n trimestral.','Completar la revisiÃ³n independiente y retirar privilegios sin justificaciÃ³n vigente.','Aprobado',(select id from public.profiles where email='auditor@demo.edu'),(select id from public.profiles where email='auditor@demo.edu')),
('60000000-0000-0000-0000-000000000002','Prueba de recuperaciÃ³n sin evidencia firmada','Continuidad de servicios crÃ­ticos','Media','Verificado','Infraestructura','2026-08-15','La prueba fue ejecutada, pero el acta de resultados no tenÃ­a firma del responsable.','Centralizar acta, evidencias y aprobaciÃ³n en el expediente de continuidad.','Aprobado',(select id from public.profiles where email='auditor@demo.edu'),(select id from public.profiles where email='auditor@demo.edu')),
('60000000-0000-0000-0000-000000000003','Inventario de cambios con registros incompletos','Cumplimiento de gestiÃ³n de cambios','Alta','Abierto','Operaciones TI','2026-11-05','Se detectaron cambios productivos sin referencia a ticket de aprobaciÃ³n.','Bloquear despliegues sin ticket, aprobador y evidencia de validaciÃ³n.','Pendiente',(select id from public.profiles where email='auditor@demo.edu'),(select id from public.profiles where email='auditor@demo.edu')),
('60000000-0000-0000-0000-000000000004','EvaluaciÃ³n anual de proveedor pendiente','Proveedores tecnolÃ³gicos crÃ­ticos','Baja','Cerrado','Riesgo operacional','2026-09-20','La evaluaciÃ³n fue completada y se archivaron las evidencias contractuales.','Mantener la revisiÃ³n anual en el calendario de terceros crÃ­ticos.','Aprobado',(select id from public.profiles where email='auditor@demo.edu'),(select id from public.profiles where email='auditor@demo.edu'))
on conflict (id) do nothing;

insert into public.action_plans (id,title,finding_title,responsible,due_date,progress,status,comments,approval_status,created_by,updated_by)
values
('70000000-0000-0000-0000-000000000001','Recertificar cuentas y retirar accesos huÃ©rfanos','RecertificaciÃ³n de cuentas privilegiadas incompleta','Seguridad TI','2026-10-10',65,'En progreso','Se completÃ³ la revisiÃ³n de administradores de infraestructura.','Aprobado',(select id from public.profiles where email='auditor@demo.edu'),(select id from public.profiles where email='auditor@demo.edu')),
('70000000-0000-0000-0000-000000000002','Firmar acta y almacenar evidencia de DRP','Prueba de recuperaciÃ³n sin evidencia firmada','Infraestructura','2026-08-15',100,'Completado','Acta aprobada por el responsable de continuidad.','Aprobado',(select id from public.profiles where email='auditor@demo.edu'),(select id from public.profiles where email='auditor@demo.edu')),
('70000000-0000-0000-0000-000000000003','Aplicar validaciÃ³n obligatoria de tickets','Inventario de cambios con registros incompletos','Operaciones TI','2026-11-05',20,'En progreso','La regla estÃ¡ en pruebas en el pipeline de despliegue.','Pendiente',(select id from public.profiles where email='auditor@demo.edu'),(select id from public.profiles where email='auditor@demo.edu')),
('70000000-0000-0000-0000-000000000004','Programar revisiÃ³n de proveedores crÃ­ticos','EvaluaciÃ³n anual de proveedor pendiente','Riesgo operacional','2026-09-20',100,'Completado','La evidencia fue validada y archivada.','Aprobado',(select id from public.profiles where email='auditor@demo.edu'),(select id from public.profiles where email='auditor@demo.edu'))
on conflict (id) do nothing;
