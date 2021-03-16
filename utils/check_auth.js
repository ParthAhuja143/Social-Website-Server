const { AuthenticationError } = require("apollo-server")
const jwt = require("jsonwebtoken")
const {SECRET_KEY} = require('../config.js')

module.exports = (context) => {
    
    const authHeader = context.req.headers.authorization
    const authError = []

    if(authHeader){
    // Bearer .... Generally auth are sent like this
    const token = authHeader.split('Bearer ')[1]
    if(token){
        try{

            const user = jwt.verify(token , SECRET_KEY)
            //console.log(user)
            return user

        }catch(err){
            
            throw new AuthenticationError('Invalid/Expired Token', {authError})
        
        }
    }
    throw new Error('Authentication token must be \'Bearer [token]\'' , {authError})
}
throw new Error('Authentication header must be provided' , {authError})
}