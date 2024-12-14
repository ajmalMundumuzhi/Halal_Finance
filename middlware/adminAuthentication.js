// client
const signupModel = require('../models/signupModel')
const authenticatedAdmin = async (req,res,next) => {
    try{
        const adminIsAuthenticated = req.session.admin
        // session.admin = username 
        const user = await signupModel.findOne({username : adminIsAuthenticated})
        const admin =  user ? user.role : null;
        if(admin === 'admin'){
            next()
        }else{
            res.redirect('/admin/adminLogin')
        }
    }
    catch(err){
        console.log("Error while authenticating admin : ",err)
        res.status(500).json({message : "Admin authantication failed"})
    }

}

module.exports = authenticatedAdmin