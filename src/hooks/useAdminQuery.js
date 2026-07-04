import { useState, useEffect, useRef } from 'react'

const cache = new Map()

export function useAdminQuery(queryFn, deps = []) {
  const key = queryFn.name || queryFn.toString().slice(0, 60)
  const [data, setData] = useState(() => cache.get(key) ?? null)
  const [loading, setLoading] = useState(() => !cache.has(key))
  const [error, setError] = useState(null)
  const fnRef = useRef(queryFn)
  fnRef.current = queryFn

  useEffect(() => {
    if (cache.has(key)) return

    let cancelled = false
    setLoading(true)
    setError(null)

    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Query timeout')), 3000)
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return { data, loading, error }
}
