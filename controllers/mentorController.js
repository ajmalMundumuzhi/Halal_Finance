const signupModel = require('../models/signupModel')

exports.dashboard = async (req,res) => {
    try{
        const username = req.session.mentor
        const mentor = await signupModel.find({username})
        
        if(!mentor){
            res.status(422).json({message : "Mentor not found"})
        }
        res.render('dashboard',{mentor : mentor[0]})
    }
    catch(err){
        console.log("Error while getting dashboard",err)
        res.status(500).json({message : "Dashboard page fialed"})
    }
} 