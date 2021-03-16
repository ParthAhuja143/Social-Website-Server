const { UserInputError } = require("apollo-server")
const Post = require("../../models/Post")
const check_auth = require("../../utils/check_auth")

module.exports = {
    Mutation : {
        async likePost(parent,args,context,info){
            const user = check_auth(context)

            const post = await Post.findById(args.postId)

            if(post){
                if(post.likes.find(like => like.username === user.username)){
                    // Post already liked
                    post.likes = post.likes.filter(like => like.username !== user.username)
                }else{
                    // Not liked
                    post.likes.push({
                        username : user.username ,
                        createdAt : new Date().toISOString()
                    })
                }
                await post.save()
                return post
            }else {
                throw new UserInputError('Post not found')
            }
        }
    }
}