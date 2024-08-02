import { useState, useEffect } from 'react'

import useCodeshare from './useCodeshare'

const sortBy = sortByField => (a, b) => {
  const direction = ['likes', 'seen'].includes(sortByField) ? 1 : -1
  if (a[sortByField] < b[sortByField]) {
    return 1 * direction
  }
  if (a[sortByField] > b[sortByField]) {
    return -1 * direction
  }
  return 0
}

export default function App () {
  const data = useCodeshare()
  const [term, termSet] = useState((document.location.hash?.replace(/^#/, '') || '') + '')
  const [sortByField, sortByFieldSet] = useState('likes')
  const [results, resultsSet] = useState([])

  useEffect(() => {
    if (term) {
      // very simplistic search
      const t = term.toLowerCase()
      resultsSet(
        (data || []).filter(row =>
          row.id.toLowerCase().includes(t) ||
            row.title.toLowerCase().includes(t) ||
            row.description.toLowerCase().includes(t)
        ).sort(sortBy(sortByField))
      )
    } else {
      resultsSet([...(data || [])].sort(sortBy(sortByField)))
    }
  }, [data, term, sortByField])

  const handleSortChange = e => sortByFieldSet(e.target.value)
  const handleSearchChange = e => {
    termSet(e.target.value)
    document.location.hash = e.target.value
  }

  return (
    <>
      <header className='navbar bg-base-200 sticky top-0 z-50'>
        <div className='flex flex-col items-start flex-1'>
          <a className='btn btn-ghost text-xl' href=''>Frida CodeShare</a>
          <p className='text-xs ml-4'>This is a searchable mirror of <a className='btn-link' href='https://codeshare.frida.re/browse'>Frida CodeShare</a> that is updated once a day. You can also download the <a className='btn-link' href='codeshare.json'>JSON</a></p>
        </div>
        <div className='flex-none gap-2'>
          <div className='text-nowrap'>Sort by</div>
          <select className='select select-bordered w-full max-w-xs' value={sortByField} onChange={handleSortChange}>
            <option value='id'>Author</option>
            <option value='likes'>Number Likes</option>
            <option value='title'>Title</option>
            <option value='seen'>Number Seen</option>
          </select>
          <div className='form-control'>
            <input type='text' placeholder='Search' className='input input-bordered w-24 md:w-auto' value={term} onChange={handleSearchChange} />
          </div>
        </div>
      </header>

      {!data && (
        <div className='m-4 flex gap-2 items-center'>
          <span className='loading loading-spinner loading-lg' /> Please wait...
        </div>
      )}

      {!!data?.length && (
        <div className='gap-2 flex flex-wrap p-4'>
          {results.map((row, i) => (
            <div key={i} className='card bg-base-100 w-96 shadow-xl'>
              <div className='card-body'>
                <h2 className='card-title'><a href={`https://codeshare.frida.re/@${row.id}`}>{row.title}</a></h2>
                <h3 className='text-xs'>by <a className='btn-link' href={`https://codeshare.frida.re/@${row.author}`}>{row.author}</a></h3>
                <h4 className='flex gap-2'><span className='icon-[iconamoon--like-fill] h-6 w-6' /> {row.likes} | {row.seen} <span className='icon-[iconamoon--eye] h-6 w-6' /></h4>
                <p>{row.description}</p>
                <div className='card-actions justify-end'>
                  <a href={`https://codeshare.frida.re/@${row.id}`} className='btn btn-primary'><span className='icon-[iconamoon--file-document] h-8 w-8' /> Project Page</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
