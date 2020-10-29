const express = require('express')
const virify = require('../middleware/verifyToken')
const { getAllPosts } = require('../controllers/posts')

const router = express.Router()

router.get('/', virify, getAllPosts)

module.exports = router