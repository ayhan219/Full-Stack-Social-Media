const Message = require("../models/Message");
const User = require("../models/User")



const postMessage = async (req, res) => {
    const { senderId, recipientId, message } = req.body;

    try {
        // Gerekli alanları kontrol et
        if (!senderId || !recipientId || !message) {
            return res.status(400).json({ message: "Provide all required fields" });
        }

        // Alıcı kullanıcının bilgilerini al
        const findRecipient = await User.findById(recipientId).select('username');
        if (!findRecipient) {
            return res.status(404).json({ message: "Recipient not found" });
        }

        // Yeni mesajı oluştur ve kaydet
        const newMessage = new Message({
            senderId: senderId,
            recipientId: recipientId,
            recipientUsername: findRecipient.username, 
            message: message
        });

        await newMessage.save();
        return res.status(200).json({ message: "Message sent successfully" });

    } catch (error) {
        return res.status(400).json(error);
    }
};


const getMessages = async(req,res)=>{
    const { userId, chatPartnerId } = req.query;

    if (!userId || !chatPartnerId) {
      return res.status(400).json({ error: 'User ID and chat partner ID are required' });
    }
  
    try {
      const messages = await Message.find({
        $or: [
          { senderId: userId, recipientId: chatPartnerId },
          { senderId: chatPartnerId, recipientId: userId }
        ]
      }).sort({ timestamp: 1 });
      
      res.status(200).json(messages);
    } catch (error) {
      console.error('Error retrieving messages:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
}



module.exports ={
    postMessage,
    getMessages
}