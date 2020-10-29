const express = require('express')
const { getAllPosts } = require('../controllers/posts')
const virify = require('../middleware/verifyToken')

const router = express.Router()

router.get('/', virify, getAllPosts)

module.exports = router