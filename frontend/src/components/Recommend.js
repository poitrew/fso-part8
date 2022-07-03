import { useLazyQuery, useQuery } from '@apollo/client'
import { ALL_BOOKS, GET_USER } from '../queries'

const Recommend = () => {
  const [bookQuery, { loading: bookloading, data: bookData }] =
    useLazyQuery(ALL_BOOKS)
  const { loading: userLoading, data: userData } = useQuery(GET_USER, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      bookQuery({ genre: data.favoriteGenre })
    },
  })

  if (userLoading || bookloading) return 'loading...'

  return (
    <div>
      <h2>recommendations</h2>
      <p>
        books in your favorite genre{' '}
        <strong>{userData.me.favoriteGenre}</strong>
      </p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {bookData?.allBooks
            .filter((b) => b.genres.includes(userData.me.favoriteGenre))
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
