const {ApolloServer , PubSub} = require('apollo-server')
const mongoose = require('mongoose')

const resolvers = require('./graphql/resolvers/index.js')
const typeDefs = require('./graphql/typeDefs.js')
const {MONGODB} = require('./config.js')

const pubsub = new PubSub()

const PORT = process.env.PORT || 5000

const server = new ApolloServer({
    typeDefs : typeDefs , 
    resolvers : resolvers ,
    context : ({req}) => ({req , pubsub}) // for createPost
})

mongoose.connect(MONGODB , {useNewUrlParser : true})
     .then(() => {
         console.log('MongoDB Connected')
         return server.listen({port : PORT})
     })
     .then(res => {
        console.log(`Server running on ${res.url}`)
     })
     .catch(error => {
         console.error(error)
     })

