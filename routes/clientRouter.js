const express = require('express')
const clientRouter = express()
const clientController = require('../controllers/clientController')
const roomController = require('../controllers/roomController')
const authAuthenticated = require('../middlware/authAuthentication')

clientRouter.use(express.json())
clientRouter.use(express.urlencoded({extended : true}))
clientRouter.set('view engine','ejs')
clientRouter.set('views','./views/client')

// index
clientRouter.get('/',clientController.index)
clientRouter.get('/room',roomController.getRooms)
clientRouter.get('/room/:id',roomController.getRoomById)
clientRouter.get('/joinRoom/:id',authAuthenticated(['admin','mentor','client']),roomController.joinRoom)
//login 
clientRouter.get('/clientLogin', clientController.clientLoginGet)
clientRouter.post('/clientLogin', clientController.clientLoginPost) 
// logout 
clientRouter.get('/logout',authAuthenticated,clientController.logout)

module.exports = clientRouter