const signupModel = require('../models/signupModel')
// mentor 
const authenticatedMentor = async (req,res,next) => {
    try{
        const mentorIsAuthenticated = req.session.mentor
        const user = await signupModel.findOne({username : mentorIsAuthenticated})
        const client = user ? user.role : null;

        if(client){
            next()
        }else{
            res.redirect('/auth/login')
        }
    }
    catch(err){
        console.log("Authentication failed : ",err)
        res.status(500).json({message : "Authentication failed"})
    }
}

module.exports = authenticatedMentor