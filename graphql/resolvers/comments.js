const { UserInputError, AuthenticationError } = require("apollo-server")
const Post = require("../../models/Post")
const check_auth = require("../../utils/check_auth")

module.exports = {
    Mutation : {
        createComment : async(parent,args,context,info) => {
            const user = check_auth(context)
            if(args.body.trim() === ''){
               throw new UserInputError('Empty Comment' , {
                   errors : {
                       body : 'Comment can not be empty'
                   }
               })
            }

            const post = await Post.findById(args.postId)

            if(post){
                post.comments.unshift({
                    body : args.body,
                    username : user.username,
                    createdAt : new Date().toISOString()
                })
                await post.save()
                return post
            }else{
                throw new UserInputError('Post not found')
            }
        } , 
        deleteComment : async(parent,args,context,info) => {
            const user = check_auth(context)

            const post = await Post.findById(args.postId)

            console.log(post)
            if(post){
                const commentIndex = post.comments.findIndex(comment => comment.id === args.commentId)
                if(post.comments[commentIndex].username === user.username){
                    post.comments.splice(commentIndex , 1)
                    await post.save()
                
                    return post
                }else{
                    throw new AuthenticationError('Action not Allowed')
                }
            }else{
                throw new UserInputError('Post not found')
            }
        }
    }
}