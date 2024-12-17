const roomModel = require('../models/roomModel')

exports.chatSave = async (req,res) => {
    try{ 
        const {mentorId, senderId, message} = req.body;

        const room = await roomModel.findOne({mentor : mentorId});
        if(room){
            const chat = {
                sender : senderId,
                message : message,
                time : Date.now(),
                isMentor: mentorId === senderId
            }

            room.messages.push(chat);
            await room.save();

            res.status(200).json({ message: "Chat saved successfully", chat });
        }
        else {
            res.status(404).json({ message: "Room not found" });
        }
    }
    catch(err){
        console.log("Error while chat save : ",err)
        res.status(500).json({message : "Chat save failed"})
    }
}