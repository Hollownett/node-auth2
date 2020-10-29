const { getConnection } = require('typeorm')
const User = require('../models/User').User

exports.getAllPosts = async (req, res) => {
    const user = await getConnection().getRepository(User).findOne({id: req.user.id})
    res.json(user)
}