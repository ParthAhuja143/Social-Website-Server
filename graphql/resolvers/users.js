const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {UserInputError} = require('apollo-server')

const {validateRegisterInput , validateLoginInput} = require('../../utils/validators.js')
const {SECRET_KEY} = require('../../config.js')
const User = require('../../models/User.js')
const { getIntrospectionQuery } = require('graphql')

module.exports = {
    Query : {
      async getUser(parent , args, context , info ){
          try {
          const user = await User.findOne({username : args.username})

          console.log(user)
          if(!user){
              throw new Error('User not found')
          }

          return user

      } catch (error) {
          throw new Error(error)
      }}
    },
    Mutation : {

        async login(parent , args , context ,info){
            const {errors , valid} = validateLoginInput(args.username , args.password)
            
            if(!valid){
                throw new UserInputError('Errors' , {errors})
            }

            const user = await User.findOne({username : args.username})
            if(!user){
                errors.general = 'Username not found'
                throw new UserInputError('User not found' , {errors})
            }
            //console.log('User ' , user._doc)
            const match = await bcrypt.compare(args.password , user.password)
            if(!match){
                errors.general = 'Wrong Credentials'
                throw new UserInputError('Wrong Credentials' , {errors})
            }

            const token = jwt.sign(
                 {
                    id : user._id , 
                    email : user.email , 
                    username : user.username , 
                    displayPicURL : user.displayPicURL
                } , SECRET_KEY , {expiresIn : '1h'}
            )

            //console.log("User" , user.displayPicURL)
            return {
                ...user._doc , 
                id : user._id, 
                token: token
            }

        }, 

        async register(parent,args,context,info){
              // Validate Data
              const {valid , errors} = validateRegisterInput(args.registerInput.username , args.registerInput.email , args.registerInput.password , args.registerInput.confirmPassword )
              if(!valid){
                  throw new UserInputError('Errors' , {errors})
              }

              // User doesn't already exist
              const user =  await User.findOne({username : args.registerInput.username})
              if(user){
                 throw new UserInputError('Username is taken' , {
                     errors : {
                         username : 'This username is taken'
                     }
                 })
              }
              // Hash Password and create Auth Token
              password = await bcrypt.hash(args.registerInput.password , 12)
             
              const newUser = new User({
                  email : args.registerInput.email , 
                  username : args.registerInput.username , 
                  password : password ,
                  createdAt : new Date().toISOString(),
                  displayPicURL : args.registerInput.displayPicURL
              })

              const response = await newUser.save()
              
              const token = jwt.sign({
                  id : response._id ,
                  email : response.email ,
                  username : response.username,
                  displayPicURL : response.displayPicURL
              } , SECRET_KEY , {expiresIn : '1h'})

              return {
                  ...response._doc,
                  id : response._id , 
                  token : token 
              }

              
        }
    }
}