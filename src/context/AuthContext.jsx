import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { DATA_MODE, isSupabaseConfigured } from '../config'
import { demoUsers } from '../data/demoSeed'
import { getDemoDatabase, saveDemoDatabase } from '../services/storage'
import { supabase } from '../services/supabaseClient'

export const AuthContext = createContext(null)
const SESSION_KEY = 'audit360_demo_session_v1'

async function getSupabaseProfile(authUser) {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', authUser.id).single()
  if (error) throw error
  return { ...data, last_sign_in_at: authUser.last_sign_in_at }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (DATA_MODE === 'demo') {
      const sessionId = localStorage.getItem(SESSION_KEY)
      if (sessionId) {
        const profile = getDemoDatabase().profiles.find((item) => item.id === sessionId)
        const demo = demoUsers.find((item) => item.id === sessionId)
        if (profile) setUser({ ...profile, last_sign_in_at: demo?.last_sign_in_at })
      }
      setLoading(false)
      return undefined
    }

    if (!isSupabaseConfigured) {
      setError('Supabase no está configurado. Completa las variables VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.')
      setLoading(false)
      return undefined
    }

    supabase.auth.getSession().then(async ({ data }) => {
      try {
        setUser(data.session?.user ? await getSupabaseProfile(data.session.user) : null)
      } catch (sessionError) {
        setError(sessionError.message)
      } finally {
        setLoading(false)
      }
    })

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session?.user) setUser(null)
      else {
        try { setUser(await getSupabaseProfile(session.user)) } catch (profileError) { setError(profileError.message) }
      }
      setLoading(false)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  const login = useCallback(async (email, password) => {
    setError('')
    if (DATA_MODE === 'demo') {
      const match = demoUsers.find((item) => item.email.toLowerCase() === email.toLowerCase() && item.password === password)
      if (!match) throw new Error('Correo o contraseña incorrectos.')
      const profile = getDemoDatabase().profiles.find((item) => item.id === match.id)
      localStorage.setItem(SESSION_KEY, match.id)
      setUser({ ...profile, last_sign_in_at: new Date().toISOString() })
      return
    }
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
    if (authError) throw authError
  }, [])

  const quickLogin = useCallback(async (id) => {
    const match = demoUsers.find((item) => item.id === id)
    if (!match) return
    await login(match.email, match.password)
  }, [login])

  const logout = useCallback(async () => {
    if (DATA_MODE === 'demo') localStorage.removeItem(SESSION_KEY)
    else await supabase.auth.signOut()
    setUser(null)
  }, [])

  const updateProfile = useCallback(async (fullName) => {
    if (DATA_MODE === 'demo') {
      const db = getDemoDatabase()
      const index = db.profiles.findIndex((profile) => profile.id === user.id)
      db.profiles[index] = { ...db.profiles[index], full_name: fullName }
      saveDemoDatabase(db)
      setUser((current) => ({ ...current, full_name: fullName }))
      return
    }
    const { data, error: updateError } = await supabase.rpc('update_own_profile', { p_full_name: fullName })
    if (updateError) throw updateError
    setUser((current) => ({ ...current, full_name: data.full_name }))
  }, [user])

  const value = useMemo(() => ({ user, loading, error, login, quickLogin, logout, updateProfile, mode: DATA_MODE }), [user, loading, error, login, quickLogin, logout, updateProfile])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
