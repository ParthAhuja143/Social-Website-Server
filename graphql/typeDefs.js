const { gql } = require('apollo-server')

module.exports = gql`
type Post{
    id : ID!
    body : String!
    createdAt :String!
    username : String!
    displayPicURL : String
    comments : [Comment]!
    likes : [Like]!
    likeCount : Int!
    commentCount : Int!
}
type Comment{
    id : ID!
    createdAt : String!
    username : String!
    body : String!
}
type Like{
    id : ID!
    createdAt : String!
    username : String!
}
type User{
    id : ID!
    email : String!
    token : String!
    username : String!
    createdAt : String!
    displayPicURL : String
}
input RegisterInput{
    username : String! 
    password : String!
    confirmPassword : String!
    email : String!
    displayPicURL : String
}
type Query{
    getPosts : [Post]
    getPost(postId: ID!): Post
    getUser(username: String!) : User!
    getPostsBySingleUser(username: String!): [Post]
}
type Mutation{
    login(username: String! , password: String!) : User!
    register(registerInput: RegisterInput) : User!
    createPost(body: String!): Post!
    deletePost(postId: ID!): String!
    createComment(postId: ID! , body: String!) : Post!
    deleteComment(postId: ID! , commentId: ID!) : Post!
    likePost(postId: ID!) : Post!
}
type Subscription{
    newPost : Post!
}
`