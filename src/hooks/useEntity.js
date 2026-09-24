import { useCallback, useEffect, useState } from 'react'
import { useData } from './useData'

export function useEntity(entity) {
  const { repository, revision, refresh } = useData()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try { setRows(await repository.list(entity)) }
    catch (loadError) { setError(loadError.message) }
    finally { setLoading(false) }
  }, [entity, repository])

  useEffect(() => { load() }, [load, revision])

  const mutate = async (operation) => {
    const result = await operation()
    refresh()
    return result
  }

  return {
    rows, loading, error, reload: load,
    create: (payload) => mutate(() => repository.create(entity, payload)),
    update: (id, payload) => mutate(() => repository.update(entity, id, payload)),
    remove: (id) => mutate(() => repository.remove(entity, id)),
    review: (id, decision, notes) => mutate(() => repository.review(entity, id, decision, notes)),
  }
}
