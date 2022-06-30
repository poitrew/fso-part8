import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { EDIT_AUTHOR, ALL_AUTHORS } from '../../queries'

const SetBorn = ({ authors }) => {
  const [author, setAuthor] = useState({
    name: '',
    born: '',
  })

  // eslint-disable-next-line no-unused-vars
  const [updateAuthor, { data, loading, error }] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }, 'AllAuthors'],
  })

  if (loading) return 'editing'
  if (error) return `edit error! ${error.message}`

  const handleSubmit = (event) => {
    event.preventDefault()
    updateAuthor({
      variables: { name: author.name, setBornTo: Number(author.born) },
    })
    setAuthor((prev) => ({
      ...prev,
      born: '',
    }))
  }

  const handleChange = (event) => {
    setAuthor((prev) => ({ ...prev, [event.target.name]: event.target.value }))
  }

  return (
    <div>
      <h2>Set birthyear</h2>
      <form onSubmit={handleSubmit}>
        <select name="name" value={author.name} onChange={handleChange}>
          {authors.map((a) => (
            <option key={a.name} value={a.name}>
              {a.name}
            </option>
          ))}
        </select>
        <div>
          born
          <input
            type="text"
            name="born"
            value={author.born}
            onChange={handleChange}
          />
        </div>
        <button>update author</button>
      </form>
    </div>
  )
}

export default SetBorn
