const { registerValidation, loginValidation } = require('../utils/validation')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { getConnection } = require('typeorm')
const User = require('../models/User').User


exports.registerUser = async ( req, res ) => {
    const { error } = registerValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message)
    
    const emailExist =await getConnection().getRepository(User).findOne({email: req.body.email});
    if(emailExist) return res.status(400).send('Email already exist')
     
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(req.body.password, salt)
    let user = new User()
    user.name = req.body.name
    user.email = req.body.email
    user.password = hashPassword

    const response = {}
    try{

        user = await getConnection().getRepository(User).save(user)
        res.send( {user : user.id}) 

        response.UserId = user.id
        res.send( response )
    }catch(err){

        res.status(400).send(err)
    }
}

exports.loginUser = async ( req, res ) => {
    const { error } = loginValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    const user =await getConnection().getRepository(User).findOne({email: req.body.email})

    if(!user) return res.status(400).send('Email or password is wrong')
    
    const validPass = await bcrypt.compare(req.body.password, user.password)
  
    if(!validPass) return res.status(400).send('Email or password is wrong')
     
    const token = jwt.sign({ id: user.id }, process.env.TOKEN_SECRET)
    
    res.header('auth-token', token).send(token)
}