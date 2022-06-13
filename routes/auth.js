const router = require('express').Router();
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const { response } = require('express');
const  {registerValidation, loginValidation} = require('../validation');
const bcrypt = require('bcryptjs');

router.post('/register', async (req, res) => {

    //VALIDATE THE DATA
    const {error} =  registerValidation.apply(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //checking if the user is already in the database
    const emailExist = await User.findOne({email: req.body.email});
    if (emailExist) return res.status(400).send('Email already exists');


    //Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //create a new user
    const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            telefones: req.body.telefones
        });
        try{
            const savedUser = await user.save();
            res.send(savedUser);
        } catch (err){
            res.status(400).send(err);
        }
} );


//LOGIN

router.post('/login', async (req, res) =>{
    //VALIDATE THE DATA
    const {error} =  loginValidation.apply(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //checking if the email exists
    const user = await User.findOne({email: req.body.email});
    if (!user) return res.status(400).send('Email is not found');
    //PASSWORD IS CORRECT
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).send('Invalid Password');

    //creat and assing a token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET, { expiresIn: "1h" });

    //update the user
    try{
       const result = await user.update({$set: 
        {   Token: token, 
            data_atualizacao: Date.now(), 
            ultimo_login: Date.now()
        }});
    } catch (err){
        res.status(400).send(err);
    }

    res.header('auth-token', token).send(token);

});

module.exports = router;
