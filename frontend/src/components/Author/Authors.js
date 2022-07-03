import { useQuery } from '@apollo/client'
import { ALL_AUTHORS } from '../../queries'
import BornForm from './BornForm'

const Authors = () => {
  const result = useQuery(ALL_AUTHORS)

  if (result.loading) {
    return <div>loading...</div>
  }

  const authors = result.data.allAuthors
  const loggedIn = localStorage.getItem('lib-user-token')

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.id}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {loggedIn && <BornForm authors={authors} />}
    </div>
  )
}

export default Authors
