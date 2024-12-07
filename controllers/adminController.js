const bcrypt = require('bcrypt')
const signupModel = require('../models/signupModel')
const signupValidation = require('../utilities/signupValidation')

// dashboard
exports.dashboard = (req,res) => {
    console.log("Dashboard")
    res.render('dashboard')
}

// admins list
exports.adminsGet = async (req,res) => {
    try{
        const admins = await signupModel.find({role : "admin"})
        res.render('admins',{admins})
    }
    catch(err){
        console.log("Error while get the admins page : ",err)
        res.status(500).json({message : "Admin list page failed"})
    }
}

exports.deleteAdmin = async (req,res) => {
    try{
        const adminId = req.params.id   
        const admin = await signupModel.findOne({_id : adminId})

        if(admin){
            await signupModel.deleteOne({_id : adminId})
            res.redirect('/admin/admins')
        }else{
            res.status(404).json({message : "Admin not found"})
        }
    }
    catch(err){
        console.log("Error while deleting admin : ",err)
        res.status(500).json({message : "Deleting admin failed"})
    }
}

exports.addAdminGet = async (req,res) => {
    try{
        res.render('addAdmin')
    }
    catch(err){
        console.log("Error while getting addAdmin page")
        res.status(500).json({message : "Admin adding page failed"})
    }
}

exports.addAdminPost = async (req,res) => {
    try{
        const {username, name, email, password} = req.body
        const existUser = await signupModel.findOne({username : username})
        const existEmail = await signupModel.findOne({email : email})

        if(existUser){
            res.status(422).json({message : "Existing user"})
        }else if(existEmail){
            res.status(422).json({message : "Existing email"})
        }

        // rejex
        else if(!signupValidation.clientValidation(username)){
            res.status(422).json({message : "Enter a valid user name"})
        }else if(!signupValidation.nameValidation(name)){
            res.status(422).json({message : "Enter a valid name"})
        }else if(!signupValidation.emailValidation(email)){
            res.status(422).json({message : "Enter a valid email "})
        }else if(!signupValidation.passwordValidation(password)){
            res.status(422).json({message : "Enter a valid Password"})
        }else{
            const hashedPassword = await bcrypt.hash(password,10)
            const admin = new signupModel({
                username : username, 
                Name : name,
                email : email, 
                password : hashedPassword,
                role : "admin"
            })                     
            await admin.save()

            res.redirect('admins')
        } 
    }
    catch(err){
        console.log("Error while adding admin : ",err)
        res.status(500).json({message : "Adding admin failed"})
    }
}

// mentors list
exports.mentorsGet = async (req,res) => {
    try{
        const mentors = await signupModel.find({role : "mentor"})
        res.render('mentors',{mentors})
    }
    catch(err){
        console.log("Error while get mentors list : ",err)
        res.status(500).json({message : "Mentor list failed"})
    }
}

exports.deleteMentor = async(req,res) => {
    try{
        const mentorId = req.params.id
        const mentor = await signupModel.findOne({_id : mentorId})

        if(mentor){
            await signupModel.deleteOne({_id : mentorId})
            res.redirect('/admin/mentors')
        }else{
            res.redirect('/auth/login')
        }
    }
    catch(err){
        console.log("Error while deleting mentor : ",err)
        res.status(500).json({message : "Deleitng mentor failed"})
    }
}

exports.addMentorGet = async (req,res) => {
    try{
        res.render('addMentor')
    }
    catch(err){
        console.log("Error while getting addAdmin page")
        res.status(500).json({message : "Admin adding page failed"})
    }
}

exports.addMentorPost = async (req,res) => {
    try{
        const {username, name, email, password} = req.body

        if(!password){
            res.status(422).json({message : "Password is required"})
        }
        console.log(password)

        const existUser = await signupModel.findOne({username : username})
        const existEmail = await signupModel.findOne({email : email})

        if(existUser){
            res.status(422).json({message : "Username is taken"})
        }else if(existEmail){
            res.status(422).json({message : "Email address is existing"})
        }else if(!signupValidation.clientValidation(username)){
            res.status(422).json({message : "Entert a valid user name"})
        }else if(!signupValidation.nameValidation(name)){
            res.status(422).json({message : "Enter a valid name"})
        }else if(!signupValidation.emailValidation(email)){
            res.status(422).json({message : "Enter a valid email address"})
        }else if(!signupValidation.passwordValidation(password)){
            res.status(422).json({message : "Enter a valid password"})
        }else{
            const hashedPassword = await bcrypt.hash(password,10)
            const mentor = new signupModel({
                username : username,
                Name : name, 
                email : email,
                password : hashedPassword,
                role : "mentor"
            })
            await mentor.save()
            res.redirect('/admin/mentors')
        }
    }
    catch(err){
        console.log("Error while adding mentor : ",err)
        res.status(500).json({message : "Adding mentor failed"})
    }
}


// clients list 
exports.clientsGet = async (req,res) => {
    try{
        const clients = await signupModel.find({role : "client"})
        res.render('clients',{clients})
    }
    catch(err){
        console.log("Error while get client list : ",err)
        res.status(500).json({message : "Clients list failed"})
    }
}

exports.deleteClient = async (req,res) => {
    try{
        const clientId = req.params.id
        const client = await signupModel.findOne({_id : clientId})

        if(client){
            await signupModel.deleteOne({_id : clientId})
            res.redirect('/admin/clients')
        }else{
            res.redirect('/auth/login')
        }
    }
    catch(err){
        console.log("Error while deleting client details");
        res.status(500).json({message : "Deleting client failed"})
    }
}

// Add client option is not required 