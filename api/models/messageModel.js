const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    message:{
        type: String,
        required: true
    },
    to:{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    from:{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }
}, {timestamps : true});

module.exports = mongoose.model("Message", messageSchema);