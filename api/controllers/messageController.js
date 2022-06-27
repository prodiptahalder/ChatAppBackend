const Message = require('../models/messageModel');

const createMessage = (req, res, next) => {
    const {message, to, from} = req.body;
    const newMessage = new Message({
        message,
        to,
        from
    });
    newMessage.save()
    .then(chat => {
        res.status(200).json({message: "Message stored in DB", chat});
    })
    .catch(err => {
        res.status(500).json({err: err});
    })
}

const getMessages = (req, res, next) => {
    const {to, from} = req.params;
    Message
    .find({to:{ $in: [ to,from ] }, from:{ $in: [ from,to ]}})
    .sort({createdAt:1})
    .populate({
        path: 'to', 
        select: ['_id', 'username']
      })
      .populate({
        path: 'from', 
        select: ['_id', 'username']
      })
    .exec()
    .then(chats => {
        res.status(200).json({chats});
    })
    .catch(err => res.status(500).json({err}));
}

module.exports={createMessage, getMessages}