const express = require('express')
const adminRouter = express()
const adminController = require('../controllers/adminController')
const authenticatedAdmin = require('../middlware/adminAuthentication')

adminRouter.set('view engine', 'ejs');
adminRouter.set('views', './views/admin')
adminRouter.use(express.json())
adminRouter.use(express.urlencoded({extended : true}))

// dashboard
adminRouter.get('/dashboard',authenticatedAdmin,adminController.dashboard)
// admins 
adminRouter.get('/admins',authenticatedAdmin,adminController.adminsGet)
adminRouter.post('/deleteAdmin/:id',authenticatedAdmin,adminController.deleteAdmin)
adminRouter.get('/addAdmin',authenticatedAdmin,adminController.addAdminGet)
adminRouter.post('/addAdmin',authenticatedAdmin,adminController.addAdminPost)
// login
adminRouter.get('/adminLogin',adminController.adminLoginGet)
adminRouter.post('/adminLogin',adminController.adminLoginPost)
// mentors
adminRouter.get('/mentors',authenticatedAdmin,adminController.mentorsGet)
adminRouter.post('/deleteMentor/:id',authenticatedAdmin,adminController.deleteMentor)
adminRouter.get('/addMentor',authenticatedAdmin,adminController.addMentorGet)
adminRouter.post('/addMentor',authenticatedAdmin,adminController.addMentorPost)
// clients 
adminRouter.get('/clients',authenticatedAdmin,adminController.clientsGet)
adminRouter.post('/deleteClient/:id',authenticatedAdmin,adminController.deleteClient)

module.exports = adminRouter