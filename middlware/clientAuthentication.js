const signupModel = require('../models/signupModel')
// client
const authenticatedClient = async (req,res,next) => {
    try{
        const clientIsauthenticated = req.session.client //passes the username
        const user = await signupModel.findOne({username : clientIsauthenticated})
        const client = user ? user.role : null;
        if(client === 'client'){
            req.user = user
            next()
        }else{
            res.redirect('/clientLogin')
        }
    }
    catch(err){
        console.log("Error while authenticating client : ",err)
        res.status(500).json({message : "Client authentication failed"})
    }
}

module.exports = authenticatedClient