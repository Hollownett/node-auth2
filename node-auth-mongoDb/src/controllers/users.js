const User = require('../models/User')
const { registerValidation, loginValidation } = require('../utils/validation')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

exports.registerUser = async ( req, res ) => {
    const { error } = registerValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message)
    
    const emailExist =await User.findOne({email: req.body.email});
    if(emailExist) return res.status(400).send('Email already exist')
     
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(req.body.password, salt)
    const user  = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword
    })
    const response = {}
    try{
        const savedUser = await user.save()
        response.MdUserId = user.id
        res.send( response )
    }catch(err){

        res.status(400).send(err)
    }
}

exports.loginUser = async ( req, res ) => {
    const { error } = loginValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    const user =await User.findOne({email: req.body.email})

    if( !user ) return res.status(400).send('Email or password is wrong')
    
    const validPass = await bcrypt.compare(req.body.password, user.password)

    if( !validPass ) return res.status(400).send('Email or password is wrong')
     
    const token = jwt.sign({ _id: user.id }, process.env.TOKEN_SECRET)
    
    res.header('auth-token', token).send(token)
}

exports.getGoogleLogin = async (req, res) => {
    console.log(res.user)
    const token = jwt.sign({ id: res.user.id }, process.env.TOKEN_SECRET)
    
    res.header('auth-token', token).send(token)
}