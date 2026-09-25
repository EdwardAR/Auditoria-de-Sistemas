import axios from 'axios'
import { SUPABASE_ANON_KEY, SUPABASE_URL } from '../config'
import { ENTITY_TABLES } from '../utils/constants'
import { supabase } from './supabaseClient'

function ensure(result) {
  if (result.error) throw result.error
  return result.data
}

export class SupabaseRepository {
  constructor(user) {
    this.user = user
  }

  table(entity) {
    return ENTITY_TABLES[entity] || entity
  }

  async list(entity) {
    return ensure(await supabase.from(this.table(entity)).select('*').order('updated_at', { ascending: false }))
  }

  async create(entity, payload) {
    const body = { ...payload, created_by: this.user.id, updated_by: this.user.id }
    return ensure(await supabase.from(this.table(entity)).insert(body).select().single())
  }

  async update(entity, id, payload) {
    const body = { ...payload, updated_by: this.user.id }
    return ensure(await supabase.from(this.table(entity)).update(body).eq('id', id).select().single())
  }

  async remove(entity, id) {
    ensure(await supabase.from(this.table(entity)).delete().eq('id', id))
  }

  async review(entity, id, decision, notes) {
    return ensure(await supabase.rpc('review_record', {
      p_entity: this.table(entity), p_record_id: id, p_decision: decision, p_notes: notes || null,
    }))
  }

  async getDashboardData() {
    const [audits, risks, controls, incidents, controlAssessments, riskHistory] = await Promise.all([
      supabase.from('audits').select('*'),
      supabase.from('risks').select('*'),
      supabase.from('controls').select('*'),
      supabase.from('security_incidents').select('*'),
      supabase.from('control_assessments').select('*'),
      supabase.from('risk_history').select('*'),
    ])
    return {
      audits: ensure(audits), risks: ensure(risks), controls: ensure(controls), incidents: ensure(incidents),
      controlAssessments: ensure(controlAssessments), riskHistory: ensure(riskHistory),
    }
  }

  async getActivity() {
    return ensure(await supabase.from('audit_events').select('*').order('created_at', { ascending: false }).limit(200))
  }

  async submitContact(payload) {
    const response = await axios.post(`${SUPABASE_URL}/rest/v1/rpc/submit_contact`, {
      p_name: payload.name, p_email: payload.email, p_company: payload.company || null, p_message: payload.message,
    }, {
      // Publishable keys identify the public client through `apikey`.
      // Authenticated Supabase SDK calls add the user's JWT separately.
      headers: { apikey: SUPABASE_ANON_KEY },
    })
    return response.data
  }
}
