const signupModel = require('../models/signupModel')
const roomModel = require('../models/roomModel')

exports.createRoom = async (req,res) => {
    try{
        const roomName = req.body.roomName
        const mentorName = req.session.mentor
        
        if(!mentorName){
            return res.redirect('/clientLogin')
        }
        const newRoom = new roomModel({
            roomName : roomName, 
            mentor : mentorName
        })
        await newRoom.save()
        res.redirect(`/room/${newRoom._id}`)
    }   
    catch(err){
        console.log("Error while creating room",err) 
       res.status(500).json({message : "Room creation failed"})
    }   
}

exports.deleteRoom = async (req,res) => {
    try{
        const roomId = req.params.id
        const room = await roomModel.findById(roomId)

        if(room){
            await roomModel.deleteById(roomId)
            res.redirect('/room')
        }else{
            res.redirect('/room')
        }
    }
    catch(err){
        console.log("Error while deleting a room : ",err)
        res.status(500).json({message : "Deleting room failed"})
    }
}

exports.getRooms = async (req, res) => {
    try {
        const rooms = await roomModel.find();  
        console.log(rooms);

        // res.json(rooms);
        res.render('room',{rooms})
    }   
    catch (err) {
        console.log("Error while getting room list:", err);
        res.status(500).json({ message: "Room list failed" });
    }   
};   


exports.getRoomById = async (req,res) => {
    try{
        const roomId = req.params.id
        const room = await roomModel.findById(roomId)

        if(!room){
            return res.status(404).json({message : "Room not found"})
        }
        res.render('roomDetails',{room})
    }
    catch(err){
        console.log("Error while fetching room : ",err)
        res.status(500).json({message : "Fetching room details failed"})
    }
}

exports.joinRoom = async (req,res) => {
    try{
        const roomId = req.params.id
        const room = await roomModel.findById({_id : roomId})

        if(!roomId){
            res.status(402).json({message : "roomId is missing"})
        }

        if(!room){
            return res.status(404).json({message : "Room not found"})
        }

        const clientName = req.session.client
        console.log(clientName)
        if(!clientName){
            return res.redirect('/clientLogin')
        }
        if(!room.participents.includes(clientName)){
            room.participents.push(clientName)
            await room.save()
        }
        res.render('roomDetails',{room})
        // res.redirect(`/client/room/${roomId._id}`)
    }
    catch(err){
        console.log("Error while join room : ",err)
        res.status(500).json({message : "Joining room failed"})
    }
}