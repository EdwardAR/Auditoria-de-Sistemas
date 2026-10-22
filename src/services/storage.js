import { demoSeed } from '../data/demoSeed'

const DB_KEY = 'audit360_demo_database_v3'
const PREVIOUS_DB_KEY = 'audit360_demo_database_v2'
const LEGACY_DB_KEY = 'audit360_demo_database_v1'

function migrateDatabase(database) {
  const defaults = structuredClone(demoSeed)
  const migrated = { ...defaults, ...database }
  if (Number(database.schema_version || 1) < 3) {
    const replaceLegacySeed = (key, legacyIds) => {
      const customRows = (database[key] || []).filter((row) => !legacyIds.has(row.id))
      migrated[key] = [...defaults[key], ...customRows]
    }
    replaceLegacySeed('audits', new Set(Array.from({ length: 6 }, (_, index) => `20000000-0000-0000-0000-00000000000${index + 1}`)))
    replaceLegacySeed('risks', new Set(Array.from({ length: 7 }, (_, index) => `30000000-0000-0000-0000-00000000000${index + 1}`)))
    replaceLegacySeed('controls', new Set(Array.from({ length: 6 }, (_, index) => `40000000-0000-0000-0000-00000000000${index + 1}`)))
    replaceLegacySeed('findings', new Set(Array.from({ length: 4 }, (_, index) => `60000000-0000-0000-0000-00000000000${index + 1}`)))
    replaceLegacySeed('action_plans', new Set(Array.from({ length: 4 }, (_, index) => `70000000-0000-0000-0000-00000000000${index + 1}`)))
    migrated.negotiable_invoices = (database.negotiable_invoices || defaults.negotiable_invoices).map((invoice) => invoice.audit_id === defaults.audits[0].id ? { ...invoice, audit_title: defaults.audits[0].title } : invoice)
  }
  migrated.findings ||= defaults.findings
  migrated.action_plans ||= defaults.action_plans
  migrated.negotiable_invoices ||= defaults.negotiable_invoices
  migrated.invoice_stage_events ||= defaults.invoice_stage_events
  migrated.evidence_metadata ||= []
  for (const key of ['audit_program', 'audit_team', 'audit_processes', 'standards', 'audit_resources', 'audit_schedule', 'schedule_history', 'audit_evidence']) migrated[key] ??= defaults[key]
  migrated.schema_version = 3
  return migrated
}

export function getDemoDatabase() {
  const stored = localStorage.getItem(DB_KEY) || localStorage.getItem(PREVIOUS_DB_KEY) || localStorage.getItem(LEGACY_DB_KEY)
  if (stored) {
    const database = migrateDatabase(JSON.parse(stored))
    localStorage.setItem(DB_KEY, JSON.stringify(database))
    return database
  }
  const initial = structuredClone(demoSeed)
  localStorage.setItem(DB_KEY, JSON.stringify(initial))
  return initial
}

export function saveDemoDatabase(database) {
  localStorage.setItem(DB_KEY, JSON.stringify(database))
}

export function resetDemoDatabase() {
  localStorage.removeItem(DB_KEY)
  localStorage.removeItem(LEGACY_DB_KEY)
  localStorage.removeItem(PREVIOUS_DB_KEY)
  return getDemoDatabase()
}
