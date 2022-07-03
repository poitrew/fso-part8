import { useState } from 'react'

const Books = ({ books }) => {
  const [list, setList] = useState(books)
  const filters = []
    .concat(...books.map((book) => book.genres))
    .filter((f, index, arr) => index === arr.indexOf(f))

  const filterer = (value) => {
    if (value === 'all') {
      return setList(books)
    }
    return setList(books.filter((b) => b.genres.includes(value)))
  }

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
          {list.map((b) => (
            <tr key={b.title}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        {filters.map((f, index) => (
          <button key={index} onClick={() => filterer(f)}>
            {f}
          </button>
        ))}
        <button onClick={() => filterer('all')}>all genres</button>
      </div>
    </div>
  )
}

export default Books
