import { DATA_MODE } from '../config'
import { DemoRepository } from './demoRepository'
import { SupabaseRepository } from './supabaseRepository'

export function createRepository(user) {
  return DATA_MODE === 'supabase' ? new SupabaseRepository(user) : new DemoRepository(user)
}

export async function submitPublicContact(payload) {
  const repository = createRepository(null)
  return repository.submitContact(payload)
}
