import { gql } from '@apollo/client/core'

export const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`

export const GET_USER = gql`
  query GetUser {
    me {
      username
      favoriteGenre
    }
  }
`

export const ALL_BOOKS = gql`
  query AllBlogs($favoriteGenre: String) {
    allBooks(genre: $favoriteGenre) {
      id
      title
      published
      author {
        name
      }
      genres
    }
  }
`

export const ALL_AUTHORS = gql`
  query AllAuthors {
    allAuthors {
      id
      name
      born
      bookCount
    }
  }
`
export const ADD_BOOK = gql`
  mutation AddBook(
    $title: String!
    $published: Int!
    $author: String!
    $genres: [String!]!
  ) {
    addBook(
      title: $title
      published: $published
      author: $author
      genres: $genres
    ) {
      id
      title
      published
      author {
        name
      }
    }
  }
`

export const EDIT_BORN = gql`
  mutation EditBorn($name: String!, $setBornTo: Int!) {
    editBorn(name: $name, setBornTo: $setBornTo) {
      name
      born
      id
    }
  }
`
