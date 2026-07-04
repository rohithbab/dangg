import { useState, useEffect, useRef } from 'react'

export function useAdminQuery(queryFn, deps = []) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const fnRef = useRef(queryFn)
  fnRef.current = queryFn

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Query timeout')), 3000)
    )

    Promise.race([fnRef.current(), timeout])
      .then(result => {
        if (!cancelled) {
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
