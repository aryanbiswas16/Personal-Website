import { useEffect, useMemo, useState } from 'react'

export function useLocalTime(timeZone) {
  const fmt = useMemo(
    () =>
      new Intl.DateTimeFormat('en-US', {
        timeZone,
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }),
    [timeZone],
  )

  const [now, setNow] = useState(() => fmt.format(new Date()))

  useEffect(() => {
    setNow(fmt.format(new Date()))
    const id = setInterval(() => setNow(fmt.format(new Date())), 10_000)
    return () => clearInterval(id)
  }, [fmt])

  return now
}
