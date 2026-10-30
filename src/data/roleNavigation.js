import {
  Activity,
  BarChart3,
  BookOpenCheck,
  ClipboardCheck,
  ClipboardList,
  FileCheck2,
  FileSearch,
  LayoutDashboard,
  ListChecks,
  ShieldAlert,
  Target,
} from 'lucide-react'

const dashboard = {
  to: '/dashboard',
  label: 'Inicio',
  title: 'Inicio ejecutivo',
  description: 'Resumen y prioridades del rol',
  icon: LayoutDashboard,
}

const modules = {
  program: { to: '/audit-program', label: 'Programa', title: 'Programa de auditoría', description: 'Alcance, equipo y planificación', icon: BookOpenCheck },
  audits: { to: '/audits', label: 'Auditorías', title: 'Auditorías', description: 'Plan anual y revisiones', icon: FileSearch },
  risks: { to: '/risks', label: 'Riesgos', title: 'Riesgos tecnológicos', description: 'Exposición y tratamiento', icon: ShieldAlert },
  controls: { to: '/controls', label: 'Controles', title: 'Controles internos', description: 'Evaluación y cumplimiento', icon: Target },
  findings: { to: '/findings', label: 'Hallazgos', title: 'Hallazgos', description: 'Observaciones y recomendaciones', icon: ClipboardList },
  plans: { to: '/action-plans', label: 'Planes de acción', title: 'Planes de acción', description: 'Remediación y seguimiento', icon: ListChecks },
  incidents: { to: '/incidents', label: 'Incidentes', title: 'Incidentes de seguridad', description: 'Registro y respuesta de seguridad', icon: Activity },
  evidence: { to: '/evidence', label: 'Evidencias', title: 'Evidencias', description: 'Documentos que sustentan la revisión', icon: FileCheck2 },
  analytics: { to: '/analytics', label: 'Analítica', title: 'Analítica ejecutiva', description: 'Indicadores para tomar decisiones', icon: BarChart3 },
  activity: { to: '/activity', label: 'Bitácora', title: 'Bitácora de actividad', description: 'Trazabilidad de las operaciones', icon: ClipboardCheck },
}

export const ROLE_NAVIGATION = {
  Administrador: {
    description: 'Configuración, supervisión y trazabilidad general.',
    sections: [
      { label: 'Vista general', items: [dashboard, modules.program, modules.audits] },
      { label: 'Control', items: [modules.incidents, modules.analytics, modules.activity] },
    ],
  },
  Auditor: {
    description: 'Ejecución de la auditoría y registro de resultados.',
    sections: [
      { label: 'Mi trabajo', items: [dashboard, modules.audits, modules.risks] },
      { label: 'Evaluación', items: [modules.controls, modules.findings, modules.plans] },
    ],
  },
  Supervisor: {
    description: 'Revisión, aprobación y seguimiento ejecutivo.',
    sections: [
      { label: 'Supervisión', items: [dashboard, modules.findings, modules.plans] },
      { label: 'Seguimiento', items: [modules.analytics, modules.activity] },
    ],
  },
  'Responsable del Área': {
    description: 'Atención de hallazgos y entrega de evidencias.',
    sections: [
      { label: 'Mis pendientes', items: [dashboard, modules.findings, modules.plans, modules.evidence] },
    ],
  },
  Consulta: {
    description: 'Consulta ejecutiva sin opciones de modificación.',
    sections: [
      { label: 'Consulta', items: [dashboard, modules.audits, modules.analytics] },
    ],
  },
}

export function getRoleNavigation(role) {
  return ROLE_NAVIGATION[role] || ROLE_NAVIGATION.Consulta
}

export function getRoleModules(role) {
  return getRoleNavigation(role).sections.flatMap((section) => section.items).filter((item) => item.to !== '/dashboard')
}
