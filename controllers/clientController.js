const signupModel = require('../models/signupModel')
const bcrypt = require('bcrypt')

exports.index = async (req,res) => {
    try{
        res.render('index')
    }
    catch(err){
        console.log("Error while Entering to the website : ",err)
        res.status(500).json({message : "Website error"})
    }
}

exports.clientLoginGet = async (req,res) => {
    try{
        res.render('clientLogin')
    }
    catch(err){
        console.log("Error while Get clientLogin page : ",err)
        res.status(500).json({message : "Clients' login page failed"})
    }
}

exports.clientLoginPost = async (req,res) => {
    try{
        const mail = req.body.email
        const profile = await signupModel.findOne({email : mail})

        if(profile){
            const password = await bcrypt.compare(
                req.body.password, 
                profile.password
            )

            req.session.role = {
                username : profile.username,
                role : profile.role,
            }
            if(password){
                req.session.username = profile.username
                req.session.role = profile.role

                if(profile.role === 'mentor'){
                    req.session.mentor = profile.username
                    res.redirect('/mentor/dashboard')
                }else{
                    res.redirect('/clientLogin')
                }
            }else{
                console.log("Password is incorrect")
                res.status(400).json({message : "Check your password"})
            }
        }else{
            console.log("Check your Login details")
            res.status(401).json({message : "Check your details"})
        }
    }
    catch(err){
        console.log("Error while login Post : ",err)
        res.status(500).json({message : "Error while post login"})
    }
}