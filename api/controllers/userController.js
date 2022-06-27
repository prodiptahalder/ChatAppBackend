const User = require('../models/userModel');
const bcrypt = require('bcrypt');

const register = (req, res, next) => {
    const {username, email, password} = req.body;
    bcrypt.hash(password, 10, (err, hash) => {
        if(err) res.status(500).json({message: "Error while generating hash", err:err});
        else{
            const user = new User({
                username:username,
                email:email,
                password: hash,
                contacts:[]
            });
            user.save()
            .then(user => {
                res.status(200).json({message:"User created successfully", user:{_id:user._id, username:user.username, email:user.email, status:true}});
            })
            .catch(error => {
                if(error&&error.code==11000){
                    let message = "";
                    for(const key in error.keyValue){
                        message+=error.keyValue[key]+" "+key+" ";
                    }
                    message+="exists";
                    res.status(400).json({message, error});
                }
                res.status(400).json({message: "error", error});
            })
        }
    });
}

const login = (req, res, next) => {
    const{username, password} = req.body;
    User.findOne({username: username})
    .populate({
        path: 'contacts', 
        select: ['_id', 'username']
      })
    .exec()
    .then(user => {
        if(user){
            bcrypt.compare(password, user.password, (err, result)=>{
                if(err) res.status(401).json({message:"Auth failed"});
                else if(result) {
                    res.status(200).json({message:"Auth Successful", user:{_id:user._id, username:user.username, email:user.email, contacts:user.contacts, status:true}});
                }
                else res.status(401).json({message:"Auth failed"});
            })
        }
        else{
            res.status(404).json({message: "No such user found"});
        }
    })
}

const getAllUsers = async (req, res, next) => {
    const id = req.params.id;
    await User.find({_id:{$ne:id}})
    .select(["email", "username", "_id"])
    .exec()
    .then(users => {
        if(users.length > 0){
            res.status(200).json({message:"Users found", count:users.length, users:users});
        }
        else{
            res.status(404).json({message: "No users found"});
        }
    }).catch(err => res.status(404).json({message: "No users found"}));

}

const addContact = (req, res, next) => {
    const {contact, user} = req.body;
    User.find({username: contact})
    .exec()
    .then(contact => {
        if(contact.length>0){
            User.updateOne({_id:user}, {
                $addToSet: {
                    contacts: contact[0]._id
                }
            })
            .exec()
            .then(userRes => {
                User.updateOne({_id:contact[0]._id}, {
                    $addToSet: {
                        contacts: user
                    }
                })
                .exec()
                .then(result => {
                    console.log(result);
                    res.status(200).json({message:"Contact added and you are added to contact's contact"})
                })
                .catch(err => {
                    User.updateOne({_id:user}, {
                        $pop: {
                            contacts: l
                        }
                    })
                    .exec()
                    .then(result => res.status(500).json({message:"error while addding you to contact"}))
                    .catch(error => res.status(500).json({message:"error while addding you to contact"}))
                }); 
            })
            .catch(err => res.status(500).json({message:"error while addding Contact"}));
        }
        else{
            res.status(404).json({message: "No such contact found"})
        }
    })
    .catch(err => res.status(500).json({message:"Error while fetching Contact"}))
}

const getContacts = (req, res, next) => {
    const id = req.params.id;
    User.findById(id)
    .populate({
        path: 'contacts', 
        select: ['_id', 'username']
      })
    .exec()
    .then(user => {
        res.status(200).json({user});
    })
    .catch(err => res.status(500).json({err: err}))
}

module.exports={register, login, getAllUsers, addContact, getContacts};