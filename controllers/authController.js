const signupModel = require('../models/signupModel')
const signupValidation = require('../utilities/signupValidation')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const crypto = require('crypto')
const JWT_SECRET = process.env.JWT_SECRET
const nodemailer = require('nodemailer')

// sign up
exports.signupGet = (req,res) => {
    res.render('signup')
}

exports.signupPost = async (req,res) => {
    try{
        const {username, name, email, password} = req.body
        const alreadyUser = await signupModel.findOne({username : username})
        const alreadyEmail = await signupModel.findOne({email : email})

        if(alreadyUser){
            return res.status(422).json({message : "The Username is already taken"})
        }
        if(alreadyEmail){
            return res.status(422).json({message : "The email id is already taken"})
        }
        if(!signupValidation.validationField([username,email,password])){
            return res.status(422).json({message : "Please provide all details"})
        } else if(!signupValidation.clientValidation(username)){
            return res.status(422).json({message : "Enter a valid email username"})
        } else if(!signupValidation.nameValidation(name)){
            res.status(422).json({message : "Enter a valid name"})
        }else if(!signupValidation.emailValidation(email)){
            return res.status(422).json({message : "Enter a valid email id"})
        }else if(!signupValidation.passwordValidation(password)){
            return res.status(422).json({message : "Enter a strong password"})
        }else{
            const hashedPassword = await bcrypt.hash(password,10)
            const newPerson = new signupModel({
                username : username,
                Name : name, 
                email : email,
                password : hashedPassword
            })
            await newPerson.save()
            res.redirect('/auth/login')
        }
    }
    catch(err){
        console.log("Error while post the signing up : ",err)
        res.status(500).json({message : "Signing up failed"})
        res.redirect('/auth/singup')
    }
}

// login 

exports.loginGet = (req,res) => {
    res.render('login')
}
exports.loginPost = async (req,res) => {
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
                if(profile.role === "admin"){
                    req.session.admin =profile.username 
                    res.redirect('/admin/dashboard')
                }else if(profile.role === "mentor"){
                    req.session.mentor = profile.username
                    res.redirect('/mentor/dashboard')
                }else if(profile.role === 'client'){
                    req.session.client =profile.username
                    res.redirect('/')
                }
            }else{
                console.log("Password is incorrect")
                res.status(400).json({message : "Check your password"})
            }
        }else{
            console.log("Check your details")
            res.status(401).json({user : "admin", data : "Check your details"})
        }
    }
    catch(err){
        console.log("Error while login : ",err)
        res.status(500).json({message : "Logging in failed"})
    }
}
// recover password
exports.recoverPasswordGet = (req,res) => {
    res.render('recoverPassword')
}

exports.recoverPasswordPost = async (req,res) => {
    try{

        const {email} = req.body;
        const mail = await signupModel.findOne({email : email}).exec()
        const generateOtp = crypto.randomInt(100000,999999)
        
        req.session.email = email
        console.log(email)
        if(mail){
            mail.otp = generateOtp
            await mail.save()
            console.log("There have a similar one",mail)  
            // node mailer 
            const transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                  user: process.env.EMAIL_USER, 
                  pass: process.env.EMAIL_PASS,  
                }
              });
              const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Password Recovery',
                text: `It is your OTP for recovery of your password ${generateOtp}`,
              };

              await transporter.sendMail(mailOptions)
              console.log("Email send succesfully ")

        
            res.redirect('/auth/otpVerification')
        }else{
            console.log("Email not found")
            res.status(401).json({message : "Your email is not existing"})
        }
    }
    catch(err){
        console.log("Error while Post recover pass page : ",err)
        res.status(500).json({message : "Error on recovering password"})
    }
}

// enter otp
exports.otpVerificationGet = (req,res) => {

    const email = req.session.email
    if (email) {
        res.render('otpVerification')
    }else{
        res.redirect('/auth/recoverPassword')
    }
    
}
exports.otpVerificationPost = async (req,res) => {
    try{
        const {otp} = req.body
        const newOtp = await signupModel.findOne({otp : otp})
        const email = newOtp ? newOtp.email : null

        if(email === req.session.email){
            // flag
            req.session.isVerifired = true
            newOtp.otp = undefined
            await newOtp.save()
            res.redirect('/auth/newPassword')
            
        }else{
            res.status(400).json({message : "OTP is invalid"})
        }
    }   
    catch(err){
        console.log("Error post OTP : ",err)
        res.status(500).json({message : "Otp verification failed"})
    }   
}       

// new password 
exports.newPasswordGet = async (req,res) =>{ 
    try{
        const {email,isVerifired} = req.session 
        if(email && isVerifired){
            res.render('newPassword')
        }else{
            res.redirect('/auth/recoverPassword')
        }
    }   
    catch(err){
        console.log("Error while get new password : ",err)
        res.status(500).json({message : "newPassword page failed"})
    }   
}       
        
exports.newPasswordPost = async (req,res) => {
    try{
        const { password } = req.body
        
        if(!signupValidation.passwordValidation(password)){
            return res.status(422).json({message : "Enter a valid password"})
        }else{
            console.log('Password changed',password)
            const hashedPassword = await bcrypt.hash(password,10)
            const email = req.session.email // email
            const mail = await signupModel.findOne({email})
 
            if(mail){
                await signupModel.findOneAndUpdate({
                    password : hashedPassword
                })
                res.redirect('/auth/login')
                // req.session.destroy()
            }else{
                res.redirect('/auth/recoverPassword')
            }
        
        }
    }
    catch(err){
        console.log("Error while post new password : ",err)
        res.status(500).json({message : "Updating password "})
    }
}
 
exports.editProfileGet = async (req,res) => {
    try{
        res.render('editProfile')
    }
    catch(err){
        console.log('Error while Get editProfile page : ',err)
        res.status(500).json({message : "Edit profile page failed"})
    }
}
