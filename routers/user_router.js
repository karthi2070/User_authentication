const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../model/user_model'); 

const router = express.Router();


router.get('/', async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// POST: Register a new user
router.post('/register', async (req, res) => {
    try {
        const { name, mobile_num, email, password } = req.body;
       
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
      
        const newUser = await User.create({name,mobile_num,email,password: hashedPassword,
        });
            res.json({ msg: 'User added successfully', user: newUser });
        } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// POST: Login user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the email exists in the database
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ msg: 'Email does not exist. Please register first.' });
        }

        // Validate the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ msg: 'Invalid password. Please try again.' });
        }

        // Login successful
        res.json({ msg: 'Login successful', user: { id: user.id, email: user.email, name: user.name } });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
