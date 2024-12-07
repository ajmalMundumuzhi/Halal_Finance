
exports.index = async (req,res) => {
    try{
        res.render('index')
    }
    catch(err){
        console.log("Error while Entering to the website : ",err)
        res.status(500).json({message : "Website error"})
    }
}