const express = require('express'); // require express
const router = require('router'); // require router
const User = require('./../models/user') // require user schema
const {jwtAuthMiddleware, generateToken} = require(''); // require jwt auth middleware

// post route to add a new user
router.post('/signup', async(req, res) => {
    
})