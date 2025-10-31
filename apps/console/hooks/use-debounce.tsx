import { useEffect, useState, useRef } from "react"

export const useDebounceRequest = <T, P>(
  fn: (params: P) => Promise<T>,
  delay: number,
  deps: any[],
  params: P,
  enabled: boolean = true
) => {
  const [pending, setPending] = useState(false)
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<any>(null)
  const timer = useRef<NodeJS.Timeout | null>(null)

  const execute = async () => {
    setPending(true)
    setError(null)
    try {
      const res = await fn(params)
      setData(res)
    } catch (err) {
      setError(err)
    } finally {
      setPending(false)
    }
  }

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current)
    if (!enabled) return
    timer.current = setTimeout(() => {
      execute()
    }, delay)

    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [...deps, delay,enabled])

  return {
    pending,
    data,
    error,
  }
}
