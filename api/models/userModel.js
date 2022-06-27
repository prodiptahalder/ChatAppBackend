const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    // _id: mongoose.Types.ObjectId,
    email:{
        type: String,
        required: true,
        unique:true,
        match: /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/
    },
    username:{
        type: String,
        required: true,
        unique:true,
    },
    password:{
        type: String,
        required: true
    },
    contacts:[
        {
            type: mongoose.Schema.ObjectId,
            ref: "User",
        }
    ]
}, {timestamps : true});

module.exports = mongoose.model("User", userSchema);