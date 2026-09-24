import { createContext, useMemo, useState } from 'react'
import { createRepository } from '../services/repository'
import { useAuth } from '../hooks/useAuth'

export const DataContext = createContext(null)

export function DataProvider({ children }) {
  const { user } = useAuth()
  const [revision, setRevision] = useState(0)
  const repository = useMemo(() => createRepository(user), [user])
  const value = useMemo(() => ({ repository, revision, refresh: () => setRevision((value) => value + 1) }), [repository, revision])
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}
