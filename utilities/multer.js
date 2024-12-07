const multer = require('multer')

const storage = multer.diskStorage({
    destination : function(req,file,cb){
        if(file.fieldname === 'profileImage'){
            cb(null,'./public/images/upload/profile')
        }
    },
    filename : function(req,file,cb){
        const uniqueSuffix = Date.now + '-' + file.originalname
        cb(null, uniqueSuffix)
    }
})

module.exports = storage 