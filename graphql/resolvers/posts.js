const {AuthenticationError} = require('apollo-server')

const User = require('../../models/User.js')
const Post = require('../../models/Post.js')
const check_auth = require('../../utils/check_auth.js')



module.exports = {
    Query : {
        async getPosts(){
            try {
                const posts = await Post.find().sort({createdAt : -1})
                //console.log(posts)
                return posts
            } catch (error) {
                throw new Error(error)                  
            }
        }, 

        async getPost(parent , args, context , info){
            try{

                const post = await Post.findById(args.postId)
            
                if(post){
                    return post
                }else{
                    throw new Error('Post not found')
                }
            }
            catch(error){
                throw new Error(error)
            }
        },
        async getPostsBySingleUser(parent,args,context,info){
            try {
                const postsByUser = await Post.find({username : args.username})
                //console.log(postsByUser)
               
                    return postsByUser
               
                
            } catch (error) {
                throw new Error(error)
            }
        }
    },

        Mutation: {
            async createPost(parent,args,context,info){
 
                //Check if user is logged in 
                const user = check_auth(context)
                //console.log(user)

                if(args.body.trim() === ''){
                    throw new Error('Post body must not be empty')
                }
                const newPost = new Post({
                    body : args.body , 
                    user : user.id, 
                    username : user.username ,
                    createdAt : new Date().toISOString() ,
                    displayPicURL : user.displayPicURL
                })

                
                const post = await newPost.save()
                //Publish a New Post subsrciption
                context.pubsub.publish('NEW_POST' , {
                    newPost: post
                })
               //console.log(post)
                return post        
        },
        async deletePost(parent,args,context,info){
            const user = check_auth(context)

            try{
                const post = await Post.findById(args.postId)
                if(user.username === post.username){
                    await post.delete()
                    return 'Post deleted successfully'
                }else{
                    throw new AuthenticationError('Action not allowed')
                }
           
            }catch(error){
                   throw new Error(error)
            }
        }
    }, 

    //Subsriptions are listeners ... In this case we are listening to New Posts being created
    Subscription : {
        newPost : {
            subscribe : (parent,args,context,info) => {
                return context.pubsub.asyncIterator('NEW_POST')
            }
        }
    }
}

