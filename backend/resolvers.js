const { UserInputError, AuthenticationError } = require('apollo-server')
const { PubSub } = require('graphql-subscriptions')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('./secret')

const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')

const pubsub = new PubSub()

const resolvers = {
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(['BOOK_ADDED']),
    },
  },
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
    allAuthors: async () => {
      console.log('Author find')
      return Author.find({})
    },
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
        const author =
          authorExists ||
          new Author({
            name: args.author,
            born: null,
            bookCount: 0,
          })
        const book = new Book({ ...args, author: author._id })
        author.bookCount++
        try {
          await author.save()
          await book.save()
        } catch (err) {
          throw new UserInputError(err.message, { invalidArgs: args })
        }
        pubsub.publish('BOOK_ADDED', { bookAdded: book.populate('author') })
        return book.populate('author')
      } else {
        throw new AuthenticationError('Not authenticated')
      }
    },
    // --------------
    editBorn: async (root, args, context) => {
      if (context.currentUser) {
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
      } else {
        throw new AuthenticationError('Not authenticated')
      }
    },
  },
}

module.exports = resolvers
