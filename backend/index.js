const {
  ApolloServer,
  gql,
  UserInputError,
  AuthenticationError,
} = require('apollo-server')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const JWT_SECRET = 'BLAHBLAH'

const User = require('./models/user')
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
  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

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
    me: User
  }

  type Mutation {
    createUser(username: String!, favoriteGenre: String!): User
    login(username: String!, password: String!): Token
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
    // --------------
    bookCount: async () => {
      const books = await Book.find({})
      return books.length
    },
    // --------------
    authorCount: async () => {
      const authors = await Author.find({})
      return authors.length
    },
    // --------------
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
    // --------------
    allAuthors: async () => Author.find({}),
    // --------------
    me: async (root, args, context) => {
      return context.currentUser
    },
  },
  Mutation: {
    createUser: async (root, args) => {
      const newUser = new User({ ...args })
      return newUser.save().catch((err) => {
        throw new UserInputError(err.message, { invalidArgs: args })
      })
    },
    // --------------
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })
      if (user === null || args.password !== '1234') {
        throw new UserInputError('wrong username or password')
      }

      const usesForToken = {
        username: user.username,
        id: user._id,
      }

      return {
        value: jwt.sign(usesForToken, JWT_SECRET),
      }
    },
    // --------------
    addBook: async (root, args, context) => {
      if (context.currentUser) {
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
      } else {
        throw new AuthenticationError('Not authenticated')
      }
    },
    // --------------
    editAuthor: async (root, args) => {
      const author = await Author.findOne({ name: args.name })
      if (!author) {
        return null
      }

      author.born = args.setBornTo
      try {
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
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const decodedToken = jwt.verify(auth.substring(7), JWT_SECRET)
      const currentUser = await User.findById(decodedToken.id)
      return { currentUser }
    }
  },
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
