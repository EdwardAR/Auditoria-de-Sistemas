import { demoSeed } from '../data/demoSeed'

const DB_KEY = 'audit360_demo_database_v1'

export function getDemoDatabase() {
  const stored = localStorage.getItem(DB_KEY)
  if (stored) {
    const database = JSON.parse(stored)
    const defaults = structuredClone(demoSeed)
    database.findings ||= defaults.findings
    database.action_plans ||= defaults.action_plans
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
  return getDemoDatabase()
}
