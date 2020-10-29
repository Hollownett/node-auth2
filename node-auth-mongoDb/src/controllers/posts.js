const User = require('../models/User')

exports.getAllPosts = async (req, res) => {
    const user = await User.findOne({_id: req.user._id})
    res.json(user)
}