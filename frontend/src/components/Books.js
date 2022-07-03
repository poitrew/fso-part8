import { useQuery } from '@apollo/client'
import { useEffect, useState } from 'react'
import { ALL_BOOKS } from '../queries'

const Books = () => {
  const { data, loading, refetch } = useQuery(ALL_BOOKS)
  const [filter, setFilter] = useState([])

  useEffect(() => {
    if (data) {
      setFilter(
        []
          .concat(...data?.allBooks.map((b) => b.genres))
          .filter((g, i, a) => a.indexOf(g) === i)
      )
    }
  }, [loading]) // eslint-disable-line

  if (loading) return 'loading...'

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {data.allBooks.map((b) => (
            <tr key={b.title}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {filter.map((g) => (
          <button
            onClick={() => {
              refetch({ favoriteGenre: g })
            }}
            key={g}
          >
            {g}
          </button>
        ))}
        <button onClick={() => refetch({ favoriteGenre: null })}>
          all genres
        </button>
      </div>
    </div>
  )
}

export default Books
