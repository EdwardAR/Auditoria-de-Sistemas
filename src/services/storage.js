import { demoSeed } from '../data/demoSeed'

const DB_KEY = 'audit360_demo_database_v2'
const LEGACY_DB_KEY = 'audit360_demo_database_v1'

function migrateDatabase(database) {
  const defaults = structuredClone(demoSeed)
  const migrated = { ...defaults, ...database }
  migrated.findings ||= defaults.findings
  migrated.action_plans ||= defaults.action_plans
  migrated.negotiable_invoices ||= defaults.negotiable_invoices
  migrated.invoice_stage_events ||= defaults.invoice_stage_events
  migrated.evidence_metadata ||= []
  migrated.schema_version = 2
  return migrated
}

export function getDemoDatabase() {
  const stored = localStorage.getItem(DB_KEY) || localStorage.getItem(LEGACY_DB_KEY)
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
  return getDemoDatabase()
}
