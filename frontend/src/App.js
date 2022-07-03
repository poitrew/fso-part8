import { useState } from 'react'
import Authors from './components/Author/Authors'
import Books from './components/Books'
import LoginForm from './components/LoginForm'
import NewBook from './components/NewBook'
import Recommend from './components/Recommend'
import { useApolloClient } from '@apollo/client'
import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from './queries'

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(localStorage.getItem('lib-user-token'))
  const [errorMessage, setErrorMessage] = useState()
  const { loading, data } = useQuery(ALL_BOOKS)
  const client = useApolloClient()

  if (loading) return 'loading...'

  const books = data.allBooks

  const logout = () => {
    setPage('login')
    localStorage.removeItem('lib-user-token')
    setToken(null)
    client.resetStore()
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {!token ? (
          <button onClick={() => setPage('login')}>login</button>
        ) : (
          <>
            <button onClick={() => setPage('add')}>add book</button>
            <button onClick={() => setPage('recommend')}>recommend</button>
            <button onClick={logout}>logout</button>
          </>
        )}
      </div>

      {page === 'authors' ? <Authors /> : null}

      {page === 'books' ? <Books books={books} /> : null}

      {page === 'add' && token ? <NewBook /> : null}

      {page === 'recommend' && token ? <Recommend books={books} /> : null}

      {page === 'login' && !token ? (
        <>
          <p>{errorMessage}</p>
          <LoginForm setError={setErrorMessage} setToken={setToken} />
        </>
      ) : null}
    </div>
  )
}

export default App
