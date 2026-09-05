import { useState, useEffect, useRef, useCallback, useMemo } from 'react'

const cache = new Map()

export function useAdminQuery(queryFn, deps = []) {
  // Use full function body in key so production-minified names never collide.
  // useMemo recomputes only when deps change, so toString() runs at most once per dep-set.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const key = useMemo(
    () => (queryFn._cacheKey || queryFn.toString()) + ':' + JSON.stringify(deps),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    deps
  )

  const [data, setData] = useState(() => cache.get(key) ?? null)
  const [loading, setLoading] = useState(() => !cache.has(key))
  const [error, setError] = useState(null)
  const fnRef = useRef(queryFn)
  fnRef.current = queryFn

  const run = useCallback(() => {
    cache.delete(key)
    let cancelled = false
    setLoading(true)
    setError(null)

    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Query timeout')), 10000)
    )

    Promise.race([fnRef.current(), timeout])
      .then(result => {
        if (!cancelled) {
          cache.set(key, result)
          setData(result)
          setLoading(false)
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError(err)
          setData(null)
          setLoading(false)
        }
      })

    return () => { cancelled = true }
  }, [key])

  useEffect(() => {
    if (cache.has(key)) {
      setData(cache.get(key))
      setLoading(false)
      return
    }
    return run()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  const refetch = useCallback(() => run(), [run])

  return { data, loading, error, refetch }
}

export function invalidateQuery(queryFn, deps = []) {
  const key = (queryFn._cacheKey || queryFn.toString()) + ':' + JSON.stringify(deps)
  cache.delete(key)
}
