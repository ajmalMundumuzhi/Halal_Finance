const express = require('express')
const mentorRouter = express()
const mentorController = require('../controllers/mentorController')
const roomController = require('../controllers/roomController')
const authenticatedMentor = require('../middlware/mentorAuthentication')
const adminRouter = require('./adminRouter')
const multer = require('multer')
const storage = require('../utilities/multer')
const upload = multer({storage : storage})

mentorRouter.set('view engine','ejs')
mentorRouter.set('views','./views/mentor')
mentorRouter.use(express.json())
mentorRouter.use(express.urlencoded({extended : true}))

// dashboard
mentorRouter.get('/dashboard',authenticatedMentor,mentorController.dashboard)
mentorRouter.post('/createRoom',authenticatedMentor,roomController.createRoom)

module.exports = mentorRouter   