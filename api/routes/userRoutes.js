const express = require('express');
const { register, login, getAllUsers, addContact, getContacts } = require('../controllers/userController');
const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.post("/addContact", addContact);

router.get("/allUsers/:id", getAllUsers);

router.get("/getContacts/:id", getContacts);

module.exports = router;