import { useState, useEffect } from 'react'

export default function useCodeshare () {
  const [data, setData] = useState()

  useEffect(() => {
    fetch('./codeshare.json').then(r => r.json()).then(setData)
  }, [])

  return data
}
