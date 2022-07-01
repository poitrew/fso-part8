const { ApolloServer, gql, UserInputError } = require('apollo-server')
const { v1: uuid } = require('uuid')
const mongoose = require('mongoose')
const Book = require('./models/book')
const Author = require('./models/author')

const MONGO_URI =
  'mongodb+srv://fullstack:tIp6kg5Fm675x3oc@cluster0.0wtr9.mongodb.net/libraryApp?retryWrites=true&w=majority'

console.log('connecting to', MONGO_URI)

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('connected to MongoDB'))
  .catch((err) => {
    console.log('error connecting to MongoDB', err.message)
  })

const typeDefs = gql`
  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    id: ID!
  }

  type Author {
    id: ID!
    name: String!
    born: Int
    bookCount: Int!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }

  type Mutation {
    addBook(
      title: String!
      published: Int!
      author: String!
      genres: [String!]!
    ): Book
    editAuthor(name: String!, setBornTo: Int!): Author
  }
`

const resolvers = {
  Query: {
    bookCount: async () => {
      const books = await Book.find({})
      return books.length
    },
    authorCount: async () => {
      const authors = await Author.find({})
      return authors.length
    },
    allBooks: async (root, args) => {
      let response = []
      if (args.genre) {
        response = await Book.find({ genres: { $in: [args.genre] } }).populate(
          'author'
        )
      } else {
        response = await Book.find({}).populate('author')
      }
      if (args.author) {
        response = response.filter((book) => book.author === args.author)
      }
      return response
    },
    allAuthors: async () => Author.find({}),
  },
  Mutation: {
    addBook: async (root, args) => {
      const authorExists = await Author.findOne({ name: args.author })
      const author = authorExists
        ? authorExists
        : new Author({
            name: args.author,
            born: null,
          })
      const book = new Book({ ...args, author: author._id })
      try {
        !authorExists && (await author.save())
        await book.save()
      } catch (err) {
        throw new UserInputError(err.message, { invalidArgs: args })
      }
      return book.populate('author')
    },
    editAuthor: async (root, args) => {
      const author = await Author.findOne({ name: args.name })
      if (!author) {
        return null
      }

      try {
        author.born = args.setBornTo
        await author.save()
      } catch (err) {
        throw new UserInputError(err.message, { invalidArgs: args })
      }
      return author
    },
  },
  Author: {
    bookCount: async (root) => {
      const authorBooks = await Book.find({ name: root.name })
      return authorBooks.length
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
