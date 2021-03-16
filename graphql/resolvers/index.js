//To combine resolvers

const postsResolvers = require('./posts.js')
const usersResolvers = require('./users.js')
const commentResolvers = require('./comments.js')
const likeResolvers = require('./likes.js')

module.exports = {
    Post : {
        likeCount(parent,args,context,info){
        //  parent is data which is returned when we return a post
        //  whenever we return a post we calculate the like and comment count on server side rather than client side
        //  We return a post when : 
        //       getPosts : [Post]
        //       getPost(postId : ID!): Post
        //       createPost(body: String!): Post!
        //       createComment(postId : ID! , body: String!) : Post!
        //       deleteComment(postId: ID! , commentId: ID!) : Post!
        //       likePost(postId: ID!) : Post!

        // console.log(parent)
        return parent.likes.length
    },
        commentCount(parent,args,context,info){   
        return parent.comments.length
    }
    },
    Query : {
        ...postsResolvers.Query,
        ...usersResolvers.Query
    },
    Mutation :{
        ...usersResolvers.Mutation,
        ...postsResolvers.Mutation,
        ...commentResolvers.Mutation,
        ...likeResolvers.Mutation
    },
    Subscription : {
        ...postsResolvers.Subscription
    }
}