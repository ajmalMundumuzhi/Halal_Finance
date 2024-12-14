const signupModel = require('../models/signupModel')

const authenticatedRole = (allowedRole) => {
    return async (req,res,next) => {
        try{
            const authenticatedUser = req.session.user // it stores the logged-in username or userId
            if(!authenticatedUser){
               return res.redirect('/auth/login')
            }

            const  user = await signupModel.findOne({username : authenticatedUser})
            if(user && allowedRole.includes(user.role)){
                req.user = user
                next()
            }else{
                res.redirect('/clientLogin')
            }
        }
        catch(err){
            console.log("Error while autheticating auth : ",err)
            res.status(500).json({message : ""})
        }
    }
}

module.exports = authenticatedRole