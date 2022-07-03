import { useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import { LOGIN } from '../queries'

const LoginForm = ({ setToken, setError }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [login, { data }] = useMutation(LOGIN, {
    onError: (err) => {
      setError(err.graphQLErrors[0].message)
    },
  })

  useEffect(() => {
    if (data) {
      const token = data.login.value
      localStorage.setItem('lib-user-token', token)
      setToken(token)
    }
  }, [data]) // eslint-disable-line

  const handleLogin = (event) => {
    event.preventDefault()
    login({ variables: { username, password } })
    setUsername('')
    setPassword('')
  }

  return (
    <form
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 10,
      }}
      onSubmit={handleLogin}
    >
      <input
        type="text"
        placeholder="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button>login</button>
    </form>
  )
}

export default LoginForm
