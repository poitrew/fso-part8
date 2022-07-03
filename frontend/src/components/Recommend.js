import { useQuery } from '@apollo/client'
import { GET_USER } from '../queries'

const Recommend = ({ books }) => {
  const { loading, data } = useQuery(GET_USER, { fetchPolicy: 'network-only' })

  if (loading) return 'loading...'

  return (
    <div>
      <h2>recommendations</h2>
      <p>
        books in your favorite genre <strong>{data.me.favoriteGenre}</strong>
      </p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books
            .filter((b) => b.genres.includes(data.me.favoriteGenre))
            .map((b) => (
              <tr key={b.title}>
                <td>{b.title}</td>
                <td>{b.author.name}</td>
                <td>{b.published}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}

export default Recommend
