import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { EDIT_BORN } from '../../queries'

const BornForm = ({ authors }) => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')

  // eslint-disable-next-line no-unused-vars
  const [updateAuthor] = useMutation(EDIT_BORN)

  const handleSubmit = (event) => {
    event.preventDefault()
    updateAuthor({
      variables: { name, setBornTo: Number(born) },
    })
    setName('')
    setBorn('')
  }

  return (
    <div>
      <h2>Set birthyear</h2>
      <form onSubmit={handleSubmit}>
        <select
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        >
          {authors.map((a) => (
            <option key={a.id} value={a.name}>
              {a.name}
            </option>
          ))}
        </select>
        <div>
          born
          <input
            type="text"
            name="born"
            value={born}
            onChange={(e) => setBorn(e.target.value)}
          />
        </div>
        <button>update author</button>
      </form>
    </div>
  )
}

export default BornForm
