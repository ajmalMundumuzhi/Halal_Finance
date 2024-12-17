const signupModel = require('../models/signupModel')
const bcrypt = require('bcrypt')

exports.index = async (req,res) => {
    try{
        console.log("session data : ",req.session)
        const username = req.session.username
        if(username){
            console.log("User logged in  : ",username)
            res.render('index',{username})            
        }else{
            console.log("User not found")
            res.render('index', {username : null})
        }
    }
    catch(err){
        console.log("Error while Entering to the website : ",err)
        res.status(500).json({message : "Index page failed"})
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
                    res.redirect('/')
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

exports.logout = async (req,res) => {
    try{ 
        console.log("hi")
        req.session.destroy((err) => {
            if (err) {
                console.log("Error while logging out: ", err);
                return res.status(500).json({ message: "Logging out failed" });
            } else {
                console.log("HHEH")
                return res.redirect('/');
            }
        });
    }
    catch(err){
        console.log("Error while login out : ",err)
        res.status(500).json({message : "Login out  failed"})
    }
}